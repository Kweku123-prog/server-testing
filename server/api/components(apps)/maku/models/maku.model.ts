import mongoose, { model, Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

import { ITrip as IMakuTrip, IMakuVehicleType } from "../maku.interfaces";
import { stringsUtils } from "../../../utils";
import { MakuCabStatus } from "../../../constants";

const makuVehicleTypeSchema = new Schema<IMakuVehicleType>({
  _id: {
    type: String,
    required: true,
    default: () => stringsUtils.generateUniqueString(4),
  },
  vehicleType: { type: String, required: true, unique: true },
  baseFee: { type: String, required: true },
  feePerKM: { type: String, required: true },
  riderPercentage: { type: String, required: true },
});

const tripSchema = new Schema<IMakuTrip>(
  {
    _id: {
      type: String,
      required: true,
      default: () => stringsUtils.generateUniqueString(4),
    },
    customer: { type: String, required: true, ref: "Customer" },
    driver: { type: String, required: true, ref: "DriverRider" },
    pickUpAddress: { type: String, required: true},
    pickUpCoordinates: {
      locationType: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    destinationAddress: {type: String, required: true},
    destinationCoordinates: {
      locationType: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    vehicleType: { type: String, required: true, ref: "MakuVehicleType" },
    price: { type: String },
    status: { type: String, default: MakuCabStatus.PENDING },
  },
  { timestamps: true, _id: false }
);

tripSchema.plugin(paginate)


export const MakuTrip = model<IMakuTrip, mongoose.PaginateModel<IMakuTrip>>("makuTrip", tripSchema);

export const MakuVehicleType = model<IMakuVehicleType>(
  "MakuVehicleType",
  makuVehicleTypeSchema
);
