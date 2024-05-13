import bcrypt from "bcrypt";

import { AccountApprovalStatus, STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Vendor } from "../models/vendors.model";
import { ISignupVendor, IVendor } from "../vendors.interface";
import { IShop, Shop } from "../../shops";
import { emitEvent } from "../../../services";

class VendorService {
  async checkPhoneNumberIsTaken(phoneNumber: string) {
    const vendor = await Vendor.findOne({ phoneNumber })
      .select("phoneNumber")
      .lean();

    if (vendor) {
      throw new HandleException(
        STATUS_CODES.CONFLICT,
        "Phone number exists for a registered vendor"
      );
    }

    return;
  }
  async signup(payload: ISignupVendor) {
    let middleName;
    if (payload.middleName) {
      middleName = payload.middleName;
    } else {
      middleName = null;
    }
    try {
      const newVendor = new Vendor({
        firstName: payload.firstName,
        lastName: payload.lastName,
        middleName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        password: payload.password,
        photo: payload.photo,
        govtIdPhoto: payload.govtIdPhoto,
        city: payload.city,
        state: payload.state,
        country: payload.country,
      });
      const savedVendor = await newVendor.save();
      emitEvent("create-wallet", {
        userId: savedVendor._id,
        accountType: "vendor",
      });
      return savedVendor;
    } catch (error: any) {
      throw new HandleException(STATUS_CODES.SERVER_ERROR, error.message);
    }
  }

  async getVendorByPhoneNumber(
    phoneNumber: string,
    selectFields?: string
  ): Promise<IVendor> {
    try {
      const query = Vendor.findOne({
        phoneNumber: { $eq: phoneNumber },
      });

      if (selectFields) {
        query.select(selectFields);
      }

      const vendor = await query.exec();
      if (!vendor) {
        throw new HandleException(404, "Vendor not found");
      }
      return vendor;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async login(payload: any): Promise<any> {
    try {
      const vendor = await this.getVendorByPhoneNumber(
        payload.phoneNumber,
        "phoneNumber password"
      );

      const passwordsMatch = await bcrypt.compare(
        payload.password,
        vendor.password
      );
      if (!passwordsMatch) {
        throw new HandleException(
          STATUS_CODES.UNAUTHORIZED,
          "Incorrect password"
        );
      }
      const loggedInVendor = {
        _id: vendor._id,
        phoneNumber: vendor.phoneNumber,
      };

      return loggedInVendor;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async getVendorById(id: string, selectFields?: string): Promise<IVendor> {
    try {
      const query = Vendor.findById(id);

      if (selectFields) {
        query.select(selectFields);
      }

      const vendor = await query.exec();
      if (!vendor) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "Vendor not found");
      }
      return vendor;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async getMe(id: string) {
    try {
      const vendor = await Vendor.findOne({ _id: id })
        .select("-__v -password -updatedAt")
        .lean();
      if (!vendor) {
        throw new HandleException(
          STATUS_CODES.NOT_FOUND,
          "Vendor account not found"
        );
      }
      return vendor;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getAllShopsForAVendor(vendorId: string): Promise<IShop[]> {
    try {
      const shops = await Shop.find({ vendor: vendorId })
        .select("name email phoneNumber logo")
        .populate({ path: "category", select: "name" });
      return shops;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }
}

export const vendorService = new VendorService();
