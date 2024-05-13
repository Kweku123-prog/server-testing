import { Document } from "mongoose";
import { OrderStatus } from "../../constants";

export interface IOrderItem {
  product: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  shop: string;
}

export interface IOrder extends Document {
  _id: string;
  customer: string;
  items: IOrderItem[];
  deliveryFee: number;
  deliveryAddress: {
    address: string;
    longitude: number;
  };
  deliveryAddressCord: {
    type: string;
    coordinates: [number, number];
  };
  rider: string;
  productTotal: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDeliveryRate {
  _id: string;
  baseFee: string;
  feePerKM: string;
  riderFeePerKM: string;
}
