import { PaginateModel, Schema, model } from "mongoose";

import paginate from "mongoose-paginate-v2";

import { IVendor } from "../vendors.interface";
import { encryption, stringsUtils } from "../../../utils";
import { AccountApprovalStatus, AccountStatus } from "../../../constants";

const vendorSchema = new Schema<IVendor>(
  {
    _id: {
      type: String,
      required: true,
      default: () => stringsUtils.generateUniqueString(4),
    },
    firstName: {
      type: String,
      required: true,
      set: stringsUtils.toLowerCaseSetter,
    },
    middleName: { type: String, set: stringsUtils.toLowerCaseSetter },
    lastName: {
      type: String,
      required: true,
      set: stringsUtils.toLowerCaseSetter,
    },
    phoneNumber: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      set: stringsUtils.toLowerCaseSetter,
    },
    password: { type: String, required: true },
    photo: String,
    street: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: {
      type: String,
      required: true,
      set: stringsUtils.toLowerCaseSetter,
    },
    postalCode: String,
    govtIdPhoto: { type: String, required: true },
    approvalStatus: {
      type: String,
      enum: Object.values(AccountApprovalStatus),
      default: AccountApprovalStatus.PENDING,
    },
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
    lastLoggedIn: String,
  },
  { timestamps: true, _id: false }
);

vendorSchema.plugin(paginate);

vendorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await encryption.encryptValue(this.password);
    } catch (error: any) {
      return next(error);
    }
  }
  next();
});

export const Vendor = model<IVendor, PaginateModel<IVendor>>(
  "Vendor",
  vendorSchema
);
