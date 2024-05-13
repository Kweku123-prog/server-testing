import {
  AccountApprovalStatus,
  AccountStatus,
  DriverRiderType,
} from "../../constants";

interface Location {
  type: string;
  coordinates: [number, number];
}
export interface IDriverRider extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  password: string;
  photo: string;
  accountType: DriverRiderType;
  vehicleType: string;
  vehicle: string;
  vehicleInsurancePhoto: string;
  licenseNumber: string;
  govtIdPhoto: [string];
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  accountStatus: AccountStatus;
  rating: {
    totalRatingSum: number;
    ratingCount: number;
    averageRating: number;
  };
  location: Location & Document["location"];
  approvalStatus: AccountApprovalStatus;
  lastLoggedIn: Date;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISignupDriverAndRider {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  password: string;
  photo: string;
  vehicleType: string;
  vehicle: string;
  vehicleInsurancePhoto: string;
  licenseNumber: string;
  govtIdPhoto: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface ILoginDriverAndRider {
  phoneNumber: string;
  password: string;
}
