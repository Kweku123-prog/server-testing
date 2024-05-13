import * as admin from "firebase-admin";
import { Socket } from "socket.io";
import { redisClient } from "../../../services";
import { firebaseAdmin } from "../../../config";
import { saveNotification } from "../repositery/notification.repo";
import { ITrip } from "../../maku";

class NotificationService {
  private messaging: admin.messaging.Messaging;

  constructor() {
    this.messaging = firebaseAdmin.messaging();
  }
  public async sendNotification(
    user: string,
    payload: admin.messaging.Message
  ) {
    try {
      const message = await this.messaging.send(payload);

      const { title = "", body = "" } = payload.notification || {};
      // await saveNotification(user, title, body, payload.data);

      console.log("Notification sent", message);
    } catch (error: any) {
      console.error("Error sending notification:", error);
    }
  }

  public async vendorHandleOrderRequest(socket: Socket, message: any) {
    const { vendor: vendorId } = message;
    console.log({ vendorId });
    const vendorDeviceToken = await redisClient.get(`device-token:${vendorId}`);
    console.log({ vendorDeviceToken });

    const payload = {
      notification: {
        title: "You have an order to attend to",
        body: "Accept or reject the incoming order",
      },
      data: {
        type: "attend-to-order",
        data: JSON.stringify(message),
      },
      token: `${vendorDeviceToken}`,
    };

    this.sendNotification(vendorId, payload);
    await saveNotification(
      vendorId,
      payload.notification.title,
      payload.notification.body,
      payload.data
    );
    socket.emit("order-notification-sent", message);
  }

  public async orderAccepted(order: any) {
    console.log({ id: order.customer });
    const customerDeviceToken = await redisClient.get(
      `device-token:${order.customer._id}`
    );
    console.log({ customerDeviceToken });
    const payload = {
      notification: {
        title: "Order accepted",
        body: "Your order has been accepted and being processed",
      },
      data: {
        type: "order-accepted-by-vendor",
        data: JSON.stringify(order),
      },
      token: `${customerDeviceToken}`,
    };

    await this.sendNotification(order.customer, payload);
    await saveNotification(
      order.customer._id,
      payload.notification.title,
      payload.notification.body,
      payload.data
    );
  }

  public async notifyRiderOfOrder(riderId: string, order: any) {
    const riderDeviceToken = await redisClient.get(`device-token:${riderId}`);
    console.log({ riderDeviceToken });
    const payload = {
      notification: {
        title: "You have an order to attend to",
        body: "You can choose to accept or ignore this order",
      },
      data: {
        type: "accept-order-delivery",
        data: JSON.stringify(order),
      },
      token: `${riderDeviceToken}`,
    };

    await this.sendNotification(riderId, payload);
    await saveNotification(
      riderId,
      payload.notification.title,
      payload.notification.body,
      payload.data
    );
  }

  async noitifyDriversOfMakuRequest(driverId: string, tripDetails: any) {
    const driverDeviceToken = await redisClient.get(`device-token:${driverId}`);
    const payload = {
      notification: {
        title: "There is a request for a trip",
        body: "View details and accept the trip",
      },
      data: {
        type: "accept-maku-trip-request",
        data: JSON.stringify(tripDetails),
      },
      token: `${driverDeviceToken}`,
    };
    await this.sendNotification(driverId, payload);
  }

  async notifyCustomerOnDrivalArrival(customerId: string, trip: any) {
    const driverDeviceToken = await redisClient.get(
      `device-token:${customerId}`
    );
    const payload = {
      notification: {
        title: "Driver has arrived!",
        body: "Your driver is now at the pickup location. Please proceed to the vehicle",
      },
      data: {
        type: "maku-trip",
        data: JSON.stringify(trip),
      },

      token: `${driverDeviceToken}`,
    };

    console.log(payload.data)
    await this.sendNotification(customerId, payload);
    await saveNotification(
      customerId,
      payload.notification.title,
      payload.notification.body,
      payload.data
    );
  }

  async notifyOnCancelledTrip(userId: string, whoCancelled: string, trip: any) {
    const userDeviceToken = await redisClient.get(`device-token:${userId}`);
    const payload = {
      notification: {
        title: "Trip Cancelled",
        body: `Unfortunately, your trip has been cancelled by the ${whoCancelled}. We apologize for any inconvenience`,
      },
      data: {
        type: "maku-trip",
        data: JSON.stringify(trip),
      },

      token: `${userDeviceToken}`,
    };

    console.log(payload.data)
    await this.sendNotification(userId, payload);
  }
}

export const notificationService = new NotificationService();
