import { MakuCabStatus } from "../../../constants";
import { MakuTrip } from "../../maku";

class DriversService {
  async makuTripHistory(driverId: string, page: number) {
    const query = {
      driver: driverId,
      status: {
        $nin: [
          MakuCabStatus.PENDING,
          MakuCabStatus.STARTED,
          MakuCabStatus.ENROUTE_PICKUP_LOCATION,
          MakuCabStatus.ARRIVED_PICKUP_LOCATION,
        ],
      },
    };
    const options = {
      page,
      limit: 10,
      select: "_id pickUpAddress destinationAddress price status createdAt",
      populate: [
        {
          path: "customer",
          select: "firstName lastName phoneNumber profilePhoto",
        },
      ],
      lean: true,
      leanWithId: false,
      sort: { createdAt: -1 },
    };

    const trips = MakuTrip.paginate(query, options);

    return trips;
  }

  async getMakuTripDetails(driverId: string, tripId: string) {
    const trip = await MakuTrip.findOne({ _id: tripId, driver: driverId })
      .select({
        updatedAt: 0,
        __v: 0,
        driver: 0,
        "destinationCoordinates.locationType": 0,
        "pickUpCoordinates.locationType": 0,
      })
      .populate({
        path: "customer",
        select: "firstName lastName photo phoneNumber",
      })
      .lean()
      .exec();
    return trip;
  }
}

export const driversService = new DriversService();
