import { STATUS_CODES, TransportServiceOrderStatus } from "../../../constants";
import { HandleException } from "../../../utils";
import { TransportCompany } from "../models/transport.models";
import { TowOrder } from "../models/transportOrders.model";
import { ITowingOrder } from "../transport.interface";

class TowingRepo {
  async createOrder(payload: any): Promise<Partial<ITowingOrder["_id"]>> {
    const towOrder = await TowOrder.create({
      customer: payload.customer,
      towingCompany: payload.towingCompany,
      vehicleRegNumber: payload.vehicleRegNumber,
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

    return towOrder.id
      // customer: towOrder.customer,
      // towingCompany: towOrder.towingCompany,
      // vehicleType: towOrder.vehicleType,
      // vehicleRegNumber: towOrder.vehicleRegNumber,
      // pickUpAddress: towOrder.pickUpAddress,
      // pickUpCoordinates: towOrder.pickUpCoordinates,
      // destinationAddress: towOrder.destinationAddress,
      // destinationCoordinates: towOrder.destinationCoordinates,
      // status: towOrder.status,
  }

  async getOrdersHistoryForCompany(companyId: string, page: number) {
    const query = { transportCompany: companyId };

    const options = {
      page,
      limit: 20,
      select: "createdAt status",
      populate: [
        { path: "customer", select: "firstName lastName" },
        { path: "vehicleType", select: "vehicleType" },
      ],
      lean: true,
      leanWithId: false,
    };

    const towOrders = TowOrder.paginate(query, options);
    return towOrders;
  }

  async getOrderDetails(orderId: string) {
    const towOrder = await TowOrder.findById(orderId)
      .select("pickUpAddress destinationAddress destinationCoordinates.coordinates fee status createdAt")
      .populate({ path: "customer", select: "firstName lastName phoneNumber" })
      .populate({
        path: "towingCompany",
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

  async findTowingCompanies(coordinates: [number, number]) {
    const towingCompanies = await TransportCompany.find({
      location: {
        $near: {
          $geometry: { type: "point", coordinates },
          $maxDistance: 9000,
        },
      },
      serviceType: "c6a56821",
    })
      .select(
        "name phoneNumber location.coordinates vehicleType vehicleRegNumber"
      )
      .lean()
      .exec();

    return towingCompanies;
  }

  async setStatusToEnrouteDropOffLocation(towOrderId: string) {
    const towOrder = await TowOrder.findById(towOrderId);
    if (!towOrder) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Tow Order not found");
    }

    towOrder.status = TransportServiceOrderStatus.ENROUTE_DROP_OFF_LOCATION;
    await towOrder.save();
    return towOrder;
  }

  async setStatusToArrived(towOrderId: string) {
    const towOrder = await TowOrder.findById(towOrderId);

    if (!towOrder) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Tow Order not found");
    }

    towOrder.status = TransportServiceOrderStatus.ARRIVED_PICKUP_LOCATION;
    await towOrder.save();
    return towOrder;
  }

  async setStatusToStarted(towOrderId: string) {
    const towOrder = await TowOrder.findById(towOrderId);

    if (!towOrder) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Tow Order not found");
    }

    towOrder.status = TransportServiceOrderStatus.STARTED;
    await towOrder.save();
    return towOrder;
  }

  async arrivedDestination(towOrderId: string) {
    const towOrder = await TowOrder.findById(towOrderId);

    if (!towOrder) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Tow Order not found");
    }

    towOrder.status = TransportServiceOrderStatus.ARRIVED_DESTINATION;
    await towOrder.save();
    return towOrder;
  }

  async setStatusToCompleted(towOrderId: string) {
    const towOrder = await TowOrder.findById(towOrderId);

    if (!towOrder) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Tow Order not found");
    }

    towOrder.status = TransportServiceOrderStatus.COMPLETED;
    await towOrder.save();
    return towOrder;
  }

  async setStatusToCancelled(towOrderId: string) {
    const towOrder = await TowOrder.findById(towOrderId);
    console.log({ repoTowOrder: towOrder });

    if (!towOrder) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Tow Order not found");
    }

    towOrder.status = TransportServiceOrderStatus.CANCELLED;
    await towOrder.save();
    return towOrder;
  }
}

export const towingRepo = new TowingRepo();
