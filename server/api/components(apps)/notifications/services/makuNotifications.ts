import { redisClient } from "../../../services";
import { notificationService } from "./notification.service";

class MakuNotificationService {
  async notifyCustomerOfTripStatus(trip: any, title: string, body: string) {
    const customerDeviceToken = await redisClient.get(
      `device-token:${trip.customer}`
    );
    console.log({ customerDeviceToken });
    const payload = {
      notification: {
        title,
        body,
      },
      data: {
        type: "maku-trip",
        data: JSON.stringify({ _id: trip._id, status: trip.status }),
      },
      token: `${customerDeviceToken}`,
    };
    await notificationService.sendNotification(trip.customer, payload);
  }
}

export const makuNotificationService = new MakuNotificationService();
