import mongoose, { Schema, model } from "mongoose";
import { IProduct } from "../products.interface";
import { stringsUtils } from "../../../utils";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema<IProduct>(
  {
    _id: {
      type: String,
      required: true,
      default: () => stringsUtils.generateUniqueString(4),
    },
    name: {
      type: String,
      required: true,
      set: stringsUtils.toLowerCaseSetter,
      Index: true,
    },
    description: {
      type: String,
      required: true,
      set: stringsUtils.toLowerCaseSetter,
    },
    price: { type: Number, required: true },
    photos: [{ type: String, required: true }],
    shop: { type: String, ref: "Shop", required: true },
    category: { type: String, required: true, ref: "Category" },
    vendor: { type: String, ref: "Vendor", required: true },
    sizes: [{ type: String }],
    colors: [{ type: String }],
  },
  { timestamps: true, _id: false }
);

productSchema.plugin(paginate);
export const Product = model<IProduct, mongoose.PaginateModel<IProduct>>(
  "Product",
  productSchema
);
