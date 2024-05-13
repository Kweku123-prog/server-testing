import { STATUS_CODES, TransportServiceOrderStatus } from "../../../constants";
import { HandleException } from "../../../utils";
import { Airport } from "../models/airport.model";
import { TransportCompany } from "../models/transport.models";
import { TransportDriver } from "../models/transportDrivers.model";
import { TransportTripOrder } from "../models/transportOrders.model";
import {
  ITowingOrder,
  ITransportCompany,
  ITransportDriver,
  ITransportTripOrder,
} from "../transport.interface";

class TransportRepository {
  async createCompany(payload: any) {
    const transportCompany = await new TransportCompany({
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      email: payload.email,
      password: payload.password,
      address: payload.address,
      serviceType: payload.serviceType,
      vehicleType: payload.vehicleType,
      vehicleRegNumber: payload.vehicleRegNumber,
      vehiclePhotos: payload.vehiclePhotos,
    }).save();

    return {
      _id: transportCompany._id,
      name: transportCompany.name,
    };
  }

  async updateDriver(
    driverId: string,
    transportCompanyId: string,
    payload: Partial<ITransportDriver>
  ) {
    // const select = Object.keys(payload);
    // select.push("-_id");

    const projection: Record<string, number | boolean | object> = {};
    Object.keys(payload).forEach((key) => {
      projection[key] = 1;
    });
    projection["_id"] = 0;

    const driver = await TransportDriver.findOneAndUpdate(
      { _id: driverId, transportCompany: transportCompanyId },
      { $set: payload },
      { new: true }
    )
      .select(projection)
      .lean();

    if (!driver) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Driver not found");
    }

    return driver;
  }

  async deleteDriver(driverId: string, transportCompanyId: string) {
    const result = await TransportDriver.deleteOne({
      _id: driverId,
      transportCompany: transportCompanyId,
    });
    if (result.deletedCount === 0) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Could not find driver to delete"
      );
    }
  }

  async updateProfile(id: string, payload: Partial<ITransportCompany>) {
    const select = Object.keys(payload);
    select.push("-_id");

    const transportCompany = await TransportCompany.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true }
    )
      .select(select)
      .lean();

    if (!transportCompany) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Profile not found");
    }

    return transportCompany;
  }

  async findTransportCompanies(payload: {
    pickUpCoordinates: [number, number];
    serviceType: string;
  }) {
    const transportCompanies = await TransportCompany.find({
      location: {
        $near: {
          $geometry: { type: "point", coordinates: payload.pickUpCoordinates },
          $maxDistance: 9000,
        },
      },
      serviceType: payload.serviceType,
      available: true
    })
      .select({
        name: 1,
        phoneNumber: 1,
        vehicleType: 1,
        vehicleRegNumber: 1,
        location: { coordinates: 1 },
      })
      .lean()
      .exec();

    return transportCompanies;
  }

  async createTransportOrder(
    payload: any
  ): Promise<ITransportTripOrder["_id"]> {
    const tripOrder = await TransportTripOrder.create({
      customer: payload.customer,
      transportCompany: payload.transportCompany,
      vehicleRegNumber: payload.vehicleRegNumber,
      serviceType: payload.serviceType,
      vehicleType: payload.vehicleType,
      pickUpAddress: payload.pickUpAddress,
      pickUpCoordinates: {
        coordinates: payload.pickUpCoordinates,
      },
      destinationAddress: payload.destinationAddress,
      destinationCoordinates: {
        coordinates: payload.destinationCoordinates,
      },
    });

    return tripOrder._id;
  }

  async getOrderDetails(orderId: string) {
    const towOrder = await TransportTripOrder.findById(orderId)
      .select("pickUpAddress destinationAddress destinationCoordinates.coordinates fee status createdAt")
      .populate({ path: "customer", select: "firstName lastName phoneNumber" })
      .populate({
        path: "transportCompany",
        select: "name phoneNumber address vehicleRegNumber",
      })
      .populate({ path: "vehicleType", select: "vehicleType" })
      .lean()
      .exec();

    if (!towOrder) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Tow order not found");
    }
    return towOrder;
  }

  async updateLocation(payload: {
    transportCompanyId: string;
    coordinates: [number, number];
  }) {
    const transportCompany = await TransportCompany.findById(
      payload.transportCompanyId
    ).select("location");

    if (!transportCompany) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Cannot find transportCompany"
      );
    }
    transportCompany.location.coordinates = payload.coordinates;
    await transportCompany.save();
  }

  async startWorking(transportCompanyId: string) {
    const transportCompany = await TransportCompany.findById(
      transportCompanyId
    ).select("available");

    if (!transportCompany) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Cannot find transportCompany"
      );
    }
    transportCompany.available = true;
    await transportCompany.save();
  }

  async stopWorking(transportCompanyId: string) {
    const transportCompany = await TransportCompany.findById(
      transportCompanyId
    ).select("available");

    if (!transportCompany) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Cannot find transportCompany"
      );
    }
    transportCompany.available = false;
    await transportCompany.save();
  }

  async getAirports() {
    const airports = await Airport.find({})
      .select("name address location.coordinates")
      .lean();
    return airports;
  }

  async setStatusToEnrouteDropOffLocation(orderId: string) {
    const transportOrder = await TransportTripOrder.findById(orderId);
    if (!transportOrder) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Transport Order not found"
      );
    }

    transportOrder.status = TransportServiceOrderStatus.ENROUTE_DROP_OFF_LOCATION;
    await transportOrder.save();
    return transportOrder;
  }

  async setStatusToArrived(orderId: string) {
    const transportOrder = await TransportTripOrder.findById(orderId);

    if (!transportOrder) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Transport Order not found"
      );
    }

    transportOrder.status = TransportServiceOrderStatus.ARRIVED_PICKUP_LOCATION;
    await transportOrder.save();
    return transportOrder;
  }

  async setStatusToStarted(orderId: string) {
    const transportOrder = await TransportTripOrder.findById(orderId);

    if (!transportOrder) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Transport Order not found"
      );
    }

    transportOrder.status = TransportServiceOrderStatus.STARTED;
    await transportOrder.save();
    return transportOrder;
  }

  async arrivedDestination(transportOrderId: string) {
    const transportOrder = await TransportTripOrder.findById(transportOrderId);

    if (!transportOrder) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Transport Order not found");
    }

    transportOrder.status = TransportServiceOrderStatus.ARRIVED_DESTINATION;
    await transportOrder.save();
    return transportOrder;
  }

  async setStatusToCompleted(orderId: string) {
    const transportOrder = await TransportTripOrder.findById(orderId);

    if (!transportOrder) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Transport Order not found"
      );
    }

    transportOrder.status = TransportServiceOrderStatus.COMPLETED;
    await transportOrder.save();
    return transportOrder;
  }

  async setStatusToCancelled(orderId: string) {
    const transportOrder = await TransportTripOrder.findById(orderId);
    console.log({ repotransportOrder: transportOrder });

    if (!transportOrder) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Transport Order not found"
      );
    }

    transportOrder.status = TransportServiceOrderStatus.CANCELLED;
    await transportOrder.save();
    return transportOrder;
  }
}

export const transportRepo = new TransportRepository();
