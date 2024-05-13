import { PaginateModel, Schema, model } from "mongoose";
import { IPropertyDocument } from "../houseRental.interface";
import { stringsUtils } from "../../../utils";
import paginate from "mongoose-paginate-v2";

const propertySchema = new Schema<IPropertyDocument>({
  _id: {
    type: String,
    default: () => stringsUtils.generateUniqueString(4),
  },
  title: { type: String, required: true },
  landlord: { type: String, required: true, ref: "Landlord" },
  description: { type: String, required: true },
  numberOfBedrooms: { type: Number, required: true },
  numberOfBathrooms: { type: Number, required: true },
  pets: { type: String, required: true, enum: ["yes", "no"] },
  furnished: { type: String, required: true, enum: ["yes", "no"] },
  photos: [{ type: String, required: true }],
  rentPerMonth: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number, Number], required: true },
  },
});

propertySchema.index({ location: "2dsphere" });
propertySchema.plugin(paginate);

export const Property = model<
  IPropertyDocument,
  PaginateModel<IPropertyDocument>
>("Property", propertySchema);
