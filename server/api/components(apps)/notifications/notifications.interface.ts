import { Document } from "mongoose";

export interface INotification extends Document {
  user: string;
  title: string;
  body: string;
  data: any;
}
