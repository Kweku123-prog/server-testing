import mongoose, { Schema, model, PaginateModel } from "mongoose";
import { stringsUtils } from "../../../utils";
import { ITowingOrder, ITransportTripOrder } from "../transport.interface";
import { TransportServiceOrderStatus } from "../../../constants";
import paginate from "mongoose-paginate-v2";

const towOrderSchema = new Schema<ITowingOrder>(
  {
    _id: {
      type: String,
      default: () => stringsUtils.generateUniqueString(4),
    },
    customer: {
      type: String,
      required: true,
      ref: "Customer",
    },
    towingCompany: {
      type: String,
      required: true,
      ref: "TransportCompany",
    },
    vehicleRegNumber: { type: String, required: true },
    vehicleType: {
      type: String,
      required: true,
      ref: "TransportVehicleType",
    },
    pickUpAddress: {
      type: String,
      required: true,
    },
    pickUpCoordinates: {
      type: { type: String, default: "Point" },
      coordinates: [Number, Number],
    },
    destinationAddress: {
      type: String,
      required: true,
    },
    destinationCoordinates: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number, Number], required: true },
    },
    fee: { type: String },
    status: {
      type: String,
      default: TransportServiceOrderStatus.ENROUTE_PICKUP_LOCATION,
    },
  },
  {
    timestamps: true,
  }
);

const transportTripOrderSchema = new Schema<ITransportTripOrder>(
  {
    _id: {
      type: String,
      default: () => stringsUtils.generateUniqueString(4),
    },
    customer: {
      type: String,
      required: true,
      ref: "Customer",
    },
    transportCompany: {
      type: String,
      required: true,
      ref: "TransportCompany",
    },
    vehicleRegNumber: { type: String, required: true },
    serviceType: {
      type: String,
      required: true,
      ref: "TransportServiceType",
    },
    vehicleType: {
      type: String,
      required: true,
      ref: "TransportVehicleType",
    },
    pickUpAddress: { type: String, default: null },
    pickUpCoordinates: {
      type: { type: String, default: "Point" },
      coordinates: [Number, Number],
    },
    destinationAddress: { type: String, default: null },
    destinationCoordinates: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number, Number], required: true },
    },
    fee: { type: String },
    status: {
      type: String,
      default: TransportServiceOrderStatus.ENROUTE_PICKUP_LOCATION,
    },
  },
  {
    timestamps: true,
  }
);

towOrderSchema.plugin(paginate);
transportTripOrderSchema.plugin(paginate);

export const TowOrder = model<ITowingOrder, PaginateModel<ITowingOrder>>(
  "towOrder",
  towOrderSchema
);

export const TransportTripOrder = model<
  ITransportTripOrder,
  PaginateModel<ITransportTripOrder>
>("transportTripOrder", transportTripOrderSchema);
