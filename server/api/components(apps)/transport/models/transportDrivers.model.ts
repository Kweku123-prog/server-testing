import { Schema, model } from "mongoose";
import { stringsUtils } from "../../../utils";
import { ITransportDriver } from "../transport.interface";

const transportDriverSchema = new Schema<ITransportDriver>({
  _id: {
    type: String,
    required: true,
    default: () => stringsUtils.generateUniqueString(4),
  },
  firstName: {
    type: String,
    required: true,
    set: stringsUtils.toLowerCaseSetter
  },
  lastName: {
    type: String,
    required: true,
    set: stringsUtils.toLowerCaseSetter
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  photo: {
    type: String,
    required: true,
  },
  transportCompany: {
    type: String,
    required: true,
    ref: "TransportCompany"
  }
});

export const TransportDriver = model<ITransportDriver>(
  "transportdriver",
  transportDriverSchema
);
