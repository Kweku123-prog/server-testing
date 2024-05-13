import { HandleException } from "../../../utils";
import { MessengerOrder } from "../../messenger";
import { IDriverRider } from "../driversRiders.interface";
import { DriverRider } from "../models/driversRiders.models";

class RidersService {
  async messengerOrderHistory(riderId: string, page: number) {
    const query = { rider: riderId };
    const options = {
      page,
      limit: 14,
      select: "_id pickUpAddress dropOffAddress deliveryCost status createdAt",
      lean: true,
      leanWithId: false,
      sort: { createdAt: -1 },
    };

    const messengerOrders = await MessengerOrder.paginate(query, options);

    return messengerOrders;
  }

  async getRiderById(
    riderId: string,
    selectFields?: string
  ): Promise<IDriverRider> {
    try {
      const query = DriverRider.findById(riderId);

      if (selectFields) {
        query.select(selectFields);
      }

      const rider = await query.exec();
      if (!rider) {
        throw new HandleException(404, "Rider not found");
      }
      return rider;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }
}

export const ridersService = new RidersService();
