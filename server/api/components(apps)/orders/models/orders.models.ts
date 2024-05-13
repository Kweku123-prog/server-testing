import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

import mongoose, { Schema, model } from "mongoose";

import { IDeliveryRate, IOrder } from "../orders.interface";
import { stringsUtils } from "../../../utils";
import { OrderStatus } from "../../../constants";

const orderSchema = new Schema<IOrder>(
  {
    _id: {
      type: String,
      required: true,
      default: () => stringsUtils.generateUniqueString(4),
    },
    customer: { type: String, required: true, ref: "Customer" },
    items: [
      {
        product: {
          type: String,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        size: {type: String},
        color: {type: String},
        price: {
          type: Number,
          required: true,
        },
        shop: {
          type: String,
          required: true,
          ref: "Shop",
        },
      },
    ],
    deliveryFee: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    deliveryAddressCord: {
      type: {
        type: String,
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number, Number],
        required: true,
      },
    },
    rider: { type: String, ref: "DriverRider", default: null },
    productTotal: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
  },
  { _id: false, timestamps: true }
);

orderSchema.plugin(paginate);
orderSchema.plugin(aggregatePaginate);

const deliveryRateSchema = new Schema<IDeliveryRate>({
  _id: {
    type: String,
    required: true,
    default: () => stringsUtils.generateUniqueString(4),
  },
  baseFee: {
    type: String,
    required: true,
  },
  feePerKM: { type: String, required: true },
  riderFeePerKM: { type: String, required: true },
});

export const Order = model<IOrder,  mongoose.AggregatePaginateModel<IOrder> >(
  "Order",
  orderSchema
);


export const DeliveryRate = model<IDeliveryRate>(
  "DeliveryRate",
  deliveryRateSchema
);
