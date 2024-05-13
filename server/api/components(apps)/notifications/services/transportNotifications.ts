import { redisClient } from "../../../services";
import { notificationService } from "./notification.service";

class TransportNotificationService {
    async notifyCompanyOfOrderRequest(tripOrder: any, transportCompanyId: string) {
        const transportCompanyDeviceToken = await redisClient.get(
          `device-token:${transportCompanyId}`
        );
        console.log({ transportCompanyDeviceToken });
        
        const payload = {
          notification: {
            title: "Trip request",
            body: "You have a trip order to accept",
          },
          data: {
            type: "transport-trip-request",
            data: JSON.stringify(tripOrder),
          },
          token: `${transportCompanyDeviceToken}`,
        };
        await notificationService.sendNotification(transportCompanyId, payload);
      }

      
  async notifyCustomerOfOrderStatus(transportOrder: any, title: string, body: string ) {
    const customerDeviceToken = await redisClient.get(
      `device-token:${transportOrder.customer}`
    );
    console.log({ customerDeviceToken });
    const payload = {
      notification: {
        title,
        body,
      },
      data: {
        type: "transport-trip",
        data: JSON.stringify({ _id: transportOrder._id, status: transportOrder.status }),
      },
      token: `${customerDeviceToken}`,
    };
    await notificationService.sendNotification(transportOrder.customer, payload);
  }

  async notifyOnCancelledTrip(params: {
    userId: string;
    whoCancelled: string;
    transportOrder: any;
  }) {
    const { userId, whoCancelled, transportOrder } = params;

    const userDeviceToken = await redisClient.get(`device-token:${userId}`);
    const payload = {
      notification: {
        title: "Transport order Cancelled",
        body: `Unfortunately, your trip order has been cancelled by the ${whoCancelled}. We apologize for any inconvenience`,
      },
      data: {
        type: "transport-trip",
        data: JSON.stringify(transportOrder),
      },

      token: `${userDeviceToken}`,
    };

    console.log(payload.data);
    await notificationService.sendNotification(userId, payload);
  }
}

export const transportNotificationService = new TransportNotificationService()