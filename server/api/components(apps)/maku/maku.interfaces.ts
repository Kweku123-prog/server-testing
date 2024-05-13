import { Document } from "mongoose";

export interface IMakuVehicleType extends Document {
    _id: string;
    vehicleType: string;
    baseFee: string;
    feePerKM: string
    riderPercentage: string
}

export interface ITrip extends Document {
    _id: string;
    customer: string;
    driver: string;
    pickUpAddress: string;
    pickUpCoordinates: {
        locationType: string;
        coordinates: [number, number];
    };
    destinationAddress: string;
    destinationCoordinates: {
        locationType: string;
        coordinates: [number, number];
    };
    vehicleType: string;
    price: string;
    status: string;
    date: string;

}