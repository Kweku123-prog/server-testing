import { AccountStatus } from "../../../constants";
import { IVendor } from "../../vendors";

interface ILocation {
  type: string;
  coordinates: [number, number];
}
export interface IShop extends Document {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  vendor: IVendor;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  location: ILocation & Document["location"];
  type: string;
  category: string;
  logo: string;
  status: AccountStatus;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShopType extends Document {
  _id: string;
  name: string;
  description: string;
  image: string;
}
export interface ICategory extends Document {
  _id: string;
  name: string;
  image: string;
  shopType: string;
}
export interface ICreateShop {
  name: string;
  email: string;
  phoneNumber: string;
  vendor: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  location: {
    coordinates: string;
  };
  type: string;
  category: string;
  logo: string;
}
