import { Document } from "mongoose";

export interface ITransportVehicleType extends Document {
  _id: string;
  vehicleType: string;
  serviceType: ITransportServiceType["_id"];
  photo: string;
  feePerKM: string;
  transportCompanyPercentage: string;
}

export interface ITransportServiceType extends Document {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransportCompany extends Document {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  serviceType: ITransportServiceType["_id"];
  vehicleType: ITransportVehicleType["_id"];
  vehicleRegNumber: string;
  vehiclePhotos: string[];
  available: true | false;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransportDriver extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  licenseNumber: string;
  photo: string;
  transportCompany: ITransportCompany["_id"];
}

export interface ITowingOrder extends Document {
  _id: string;
  customer: string;
  towingCompany: ITransportCompany["_id"];
  vehicleRegNumber: string;
  vehicleType: ITransportVehicleType["_id"];
  pickUpAddress: string;
  pickUpCoordinates: {
    type: string;
    coordinates: [number, number];
  };
  destinationAddress: string;
  destinationCoordinates: {
    type: string;
    coordinates: [number, number];
  };
  fee: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransportTripOrder extends Document {
  _id: string;
  customer: string;
  transportCompany: ITransportCompany["_id"];
  vehicleRegNumber: string;
  serviceType: ITransportServiceType["_id"];
  vehicleType: ITransportVehicleType["_id"];
  pickUpAddress: string;
  pickUpCoordinates: {
    type: string;
    coordinates: [number, number];
  };
  destinationAddress: string;
  destinationCoordinates: {
    type: string;
    coordinates: [number, number];
  };
  fee: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAirport extends Document {
  _id: string;
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}
