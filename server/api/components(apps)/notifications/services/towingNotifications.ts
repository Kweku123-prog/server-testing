import { redisClient } from "../../../services";
import { notificationService } from "./notification.service";

class TowingNotificationService {
  async notifyCompanyOfOrderRequest(tripOrder: any, towingCompanyId: string) {
    const towingCompanyDeviceToken = await redisClient.get(
      `device-token:${towingCompanyId}`
    );
    console.log({ towingCompanyDeviceToken });
    const payload = {
      notification: {
        title: "Trip request",
        body: "You have a trip order to accept",
      },
      data: {
        type: "towing-trip-request",
        data: JSON.stringify(tripOrder),
      },
      token: `${towingCompanyDeviceToken}`,
    };
    await notificationService.sendNotification(towingCompanyId, payload);
  }

  async notifyCustomerofOrderStatus(
    towingOrder: any,
    title: string,
    body: string
  ) {
    const customerDeviceToken = await redisClient.get(
      `device-token:${towingOrder.customer}`
    );
    console.log({ customerDeviceToken });
    const payload = {
      notification: {
        title,
        body,
      },
      data: {
        type: "towing-trip",
        data: JSON.stringify({
          _id: towingOrder._id,
          status: towingOrder.status,
        }),
      },
      token: `${customerDeviceToken}`,
    };
    await notificationService.sendNotification(towingOrder.customer, payload);
  }

  async notifyOnCancelledTrip(params: {
    userId: string;
    whoCancelled: string;
    towOrder: any;
  }) {
    const { userId, whoCancelled, towOrder } = params;

    const userDeviceToken = await redisClient.get(`device-token:${userId}`);
    const payload = {
      notification: {
        title: "Towing rip Cancelled",
        body: `Unfortunately, your trip has been cancelled by the ${whoCancelled}. We apologize for any inconvenience`,
      },
      data: {
        type: "towing-trip",
        data: JSON.stringify(towOrder),
      },

      token: `${userDeviceToken}`,
    };

    console.log(payload.data);
    await notificationService.sendNotification(userId, payload);
  }
}

export const towingNotificationService = new TowingNotificationService();
