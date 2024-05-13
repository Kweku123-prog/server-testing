import { redisClient } from "../../../services";
import { notificationService } from "./notification.service";

class MessengerNotificationService {
  public async notifyRiderOfOrder(riderId: string, order: any) {
    const riderDeviceToken = await redisClient.get(`device-token:${riderId}`);
    console.log({ riderDeviceToken });
    const payload = {
      notification: {
        title: "You have an order to attend to",
        body: "You can choose to accept or ignore this order",
      },
      data: {
        type: "accept-messenger-order-delivery",
        data: JSON.stringify(order),
      },
      token: `${riderDeviceToken}`,
    };

    await notificationService.sendNotification(riderId, payload);
  }

  async notifyCustomerOfOrderStatus(order: any, title: string, body: string) {
    const customerDeviceToken = await redisClient.get(
      `device-token:${order.customer}`
    );
    console.log({ customerDeviceToken });
    const payload = {
      notification: {
        title,
        body,
      },
      data: {
        type: "messenger-order-status",
        data: JSON.stringify({ _id: order._id, status: order.status }),
      },
      token: `${customerDeviceToken}`,
    };
    await notificationService.sendNotification(order.customer, payload);
  }

  async notifyRiderOfCancelledOrder(order: any) {
    const riderDeviceToken = await redisClient.get(
      `device-token:${order.rider}`
    )
    console.log({ riderDeviceToken });
    const payload = {
      notification: {
        title: "Order cancelled by customer",
        body: "We are sorry for any incovenience.",
      },
      data: {
        type: "messenger-order-cancelled",
        data: JSON.stringify({ _id: order._id, status: order.status }),
      },
      token: `${riderDeviceToken}`,
    };

    await notificationService.sendNotification(order.rider, payload);
  }
}

export const messengerNotificationService = new MessengerNotificationService();
