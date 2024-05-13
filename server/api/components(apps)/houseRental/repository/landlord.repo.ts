import { STATUS_CODES } from "../../../constants";
import { HandleException, encryption } from "../../../utils";
import { ILandlordDocument } from "../houseRental.interface";
import { Landlord } from "../models/landlord.model";

class LandlordRepository {
  async signup(payload: any): Promise<Partial<ILandlordDocument>> {
    const landlord = await Landlord.create(payload);

    return {
      _id: landlord._id,
      phoneNumber: landlord.phoneNumber,
      email: landlord.email,
      profilePhoto: landlord.profilePhoto,
      address: landlord.address,
      govtIdPhoto: landlord.govtIdPhoto,
    };
  }

  async login(payload: { phoneNumber: string; password: string }) {
    const landlord = await Landlord.findOne({
      phoneNumber: payload.phoneNumber,
    }).select("phoneNumber password");

    if (!landlord) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "No Landlord found");
    }

    const passwordsMatch = encryption.compareValues(
      payload.password,
      landlord.password
    );

    if (!passwordsMatch) {
      throw new HandleException(STATUS_CODES.BAD_REQUEST, "Incorrect password");
    }

    return landlord;
  }

  async update(landlordId: string, payload: any) {
    const select = Object.keys(payload);
    select.push("-_id");

    const landlord = await Landlord.findByIdAndUpdate(
      landlordId,
      { $set: payload },
      { new: true }
    ).select(select);

    if (!landlord) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "landlord not found ");
    }
    return landlord;
  }

  async deleteAccount(landlordId: string) {
    const landlord = await Landlord.findByIdAndDelete(landlordId);

    if (!landlord) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "landlord not found ");
    }
  }
}

export const landlordRepo = new LandlordRepository();
