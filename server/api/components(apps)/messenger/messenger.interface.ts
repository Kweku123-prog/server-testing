import { Document } from "mongoose";
import { ICustomer } from "../customers";
import { IDriverRider } from "../driversAndRiders";

export interface IMessengerOrder extends Document {
  _id: string;
  customer: ICustomer;
  rider: IDriverRider["_id"];
  packageType: IPackageType;
  type: "instant" | "scheduled";
  pickUpAddress: string;
  pickUpLocation: {
    type: string;
    coordinates: [number, number];
  };
  dropOffAddress: string;
  dropOffLocation: {
    type: string;
    coordinates: [number, number];
  };
  note: string;
  status: string;
  deliveryCost: number;
  scheduledPickUpTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPackageType extends Document {
  _id: string;
  packageType: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
}
