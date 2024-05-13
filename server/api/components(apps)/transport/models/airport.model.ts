import { Schema, model } from "mongoose";
import { stringsUtils } from "../../../utils";
import { IAirport } from "../transport.interface";

const airportSchema = new Schema<IAirport>({
  _id: {
    type: String,
    default: () => stringsUtils.generateUniqueString(4),
  },
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true, unique: true },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number, Number],
      required: true,
    },
  },
});

airportSchema.index({ location: "2dsphere" });

export const Airport = model<IAirport>("Airport", airportSchema);
