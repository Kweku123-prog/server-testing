import { MakuCabStatus, STATUS_CODES } from "../../../constants";
import { findClosestDriverOrRider } from "../../../services";
import { HandleException } from "../../../utils";
import { notificationService } from "../../notifications";
import { MakuTrip, MakuVehicleType } from "../models/maku.model";

class MakuService {
  public async getVehicleTypes() {
    try {
      const vehicleTypes = await MakuVehicleType.find({})
        .select("-__v")
        .lean()
        .exec();
      return vehicleTypes;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async findNearestDrivers(
    pickUpCoordinates: [number, number],
    pickUpAddress: string,
    destinationCoordinates: [number, number],
    destinationAddress: string,
    customer: string,
    searchKMLimit: number,
    vehicleType?: string
  ) {
    try {
      const drivers = await findClosestDriverOrRider(
        pickUpCoordinates,
        "driver",
        searchKMLimit,
        vehicleType
      );
      drivers.forEach((driver) => {
        notificationService.noitifyDriversOfMakuRequest(driver._id, {
          pickUpCoordinates,
          pickUpAddress,
          destinationAddress,
          destinationCoordinates,
          customer,
          vehicleType,
        });
      });
      return drivers;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async createTrip(payload: any) {
    try {
      const trip = await new MakuTrip({
        customer: payload.customer,
        driver: payload.driver,
        pickUpAddress: payload.pickUpAddress,
        pickUpCoordinates: {
          coordinates: payload.pickUpCoordinates,
        },
        destinationAddress: payload.destinationAddress,
        destinationCoordinates: {
          coordinates: payload.destinationCoordinates,
        },
        vehicleType: payload.vehicleType,
        price: payload.price
      }).save();

      return trip;
    } catch (error: any) {
      throw new HandleException(error, error.message);
    }
  }

  async driverArrivedLocation(tripId: string) {
    const trip = await MakuTrip.findByIdAndUpdate(
      tripId,
      {
        $set: { status: MakuCabStatus.ARRIVED_PICKUP_LOCATION },
      },
      { new: true }
    ).select("status customer");

    return trip;
  }

  async startTrip(tripId: string) {
    const trip = await MakuTrip.findByIdAndUpdate(
      tripId,
      {
        $set: { status: MakuCabStatus.STARTED },
      },
      { new: true }
    ).select("status customer");

    return trip;
  }

  async completeTrip(tripId: string) {
    const trip = await MakuTrip.findByIdAndUpdate(
      tripId,
      {
        $set: { status: MakuCabStatus.COMPLETED },
      },
      { new: true }
    ).select("status customer");

    return trip;
  }

  async cancelTrip(tripId: string) {
    const trip = await MakuTrip.findByIdAndUpdate(
      tripId,
      {
        $set: { status: MakuCabStatus.CANCELLED },
      },
      { new: true }
    ).select("status customer driver");

    return trip;
  }

  async getTripDetails(tripId: string) {
    const trip = MakuTrip.findById(tripId)
      .select(
        `pickUpAddress pickUpCoordinates.coordinates 
        destinationAddress destinationCoordinates.coordinates 
        price status`
      )
      .populate({
        path: "customer",
        select: "firstName lastName phoneNumber",
      })
      .populate({
        path: "driver",
        select: "firstName lastName phoneNumber vehicle",
      })
      .populate({
        path: "vehicleType",
        select: "vehicleType",
      })
      .lean()
      .exec();

    if (!trip) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "The trip was not found and might not exist"
      );
    }
    return trip;
  }
}

export const makuService = new MakuService();
