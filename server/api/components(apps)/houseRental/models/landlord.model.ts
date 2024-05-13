import { Schema, model } from "mongoose";
import { encryption, stringsUtils } from "../../../utils";
import { ILandlordDocument } from "../houseRental.interface";

const landlordSchema = new Schema<ILandlordDocument>(
  {
    _id: {
      type: String,
      default: () => stringsUtils.generateUniqueString(4),
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, default: null, unique: true },
    govtIdPhoto: { type: String, required: true },
    profilePhoto: { type: String, required: true },
    address: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

landlordSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await encryption.encryptValue(this.password);
    } catch (error: any) {
      return next(error);
    }
  }
  next();
});

export const Landlord = model("Landlord", landlordSchema);
