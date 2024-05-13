import { Document } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  photos: string[];
  shop: string; 
  category: string;
  vendor: string; 
  sizes: string[]; 
  colors: string[]; 
  createdAt: string;
  updatedAt: string;
}

export interface IAddProduct {
  name: string;
  description: string;
  price: number;
  photos: string[];
  shop: string; 
  vendor: string; 
  sizes: string[]; 
  colors: string[]; 
}


