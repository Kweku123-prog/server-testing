import { PaginateModel, Schema, model } from "mongoose";
import { stringsUtils } from "../../../utils";
import { IMessengerOrder, IPackageType } from "../messenger.interface";
import paginate from "mongoose-paginate-v2";

const messengerOrderShema = new Schema<IMessengerOrder>(
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
    rider: {
      type: String,
      ref: "DriverRider",
      default: null,
    },
    packageType: {
      type: String,
      required: true,
      ref: "PackageType",
    },
    type: { type: String, required: true },
    pickUpAddress: {
      type: String,
      required: true,
    },
    pickUpLocation: {
      type: {
        type: String,
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    dropOffAddress: {
      type: String,
      required: true,
    },
    dropOffLocation: {
      type: {
        type: String,
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    note: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: "pending",
    },
    deliveryCost: { type: Number, required: true },
    scheduledPickUpTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

messengerOrderShema.plugin(paginate);

const packageTypeSchema = new Schema<IPackageType>(
  {
    _id: {
      type: String,
      default: () => stringsUtils.generateUniqueString(4),
    },
    packageType: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PackageType = model<IPackageType>(
  "PackageType",
  packageTypeSchema
);
export const MessengerOrder = model<
  IMessengerOrder,
  PaginateModel<IMessengerOrder>
>("messengerOrder", messengerOrderShema);
