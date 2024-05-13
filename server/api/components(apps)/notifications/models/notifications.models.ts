import mongoose, { model, Schema } from "mongoose";
import { INotification } from "../notifications.interface";
import paginate from "mongoose-paginate-v2";

const notificationSchema = new Schema(
  {
    user: {
      type: String,
      ref: "Customer" || "Vendor" || "DriverRider",
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, default: null },
    data: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

notificationSchema.plugin(paginate);

export const Notifications = model<
  INotification,
  mongoose.PaginateModel<INotification>
>("notification", notificationSchema);
