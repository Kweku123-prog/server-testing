import { Customer } from "../components(apps)/customers";
import { DriverRider } from "../components(apps)/driversAndRiders";
import { Vendor } from "../components(apps)/vendors";
import { STATUS_CODES } from "../constants";
import { HandleException } from "../utils";

class UserService {
  public async isEmailTaken(email: string) {
    const customer = await Customer.findOne({
      email: { $eq: email },
    })
      .select("email")
      .lean();

    const driverRider = await DriverRider.findOne({ email })
      .select("email")
      .lean();

    const vendor = await Vendor.findOne({ email }).select("email").lean();

    if (customer || driverRider || vendor) {
      throw new HandleException(
        STATUS_CODES.CONFLICT,
        "Email is already taken"
      );
    }

    return false; // Email is not taken
  }

  public async isPhoneNumberTaken(phoneNumber: string) {
    const customer = await Customer.findOne({
      phoneNumber: { $eq: phoneNumber },
    }).select("phoneNumber");
    const driverRider = await DriverRider.findOne({ phoneNumber }).select(
      "phoneNumber"
    );
    const vendor = await Vendor.findOne({ phoneNumber }).select("phoneNumber");
    if (customer || driverRider || vendor) {
      throw new HandleException(
        STATUS_CODES.CONFLICT,
        "Phone number is already taken"
      );
    }
    return false;
  }

  public async getUserAccountModel(accountType: string) {
    switch (accountType) {
      case "customer":
        return Customer;
      case "vendor":
        return Vendor;
      case "driver-rider":
        return DriverRider;
      default:
        throw new HandleException(
          STATUS_CODES.BAD_REQUEST,
          "Invalid account type"
        );
    }
  }
}

export const userService = new UserService();
