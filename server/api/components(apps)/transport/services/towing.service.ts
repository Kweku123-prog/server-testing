import { STATUS_CODES } from "../../../constants";
import { HandleException, encryption } from "../../../utils";
import { towingNotificationService } from "../../notifications";
import {
  TransportCompany,
  TransportVehicleType,
} from "../models/transport.models";
import { towingRepo } from "../repository/towing.repo";

class TowingService {
  async login(payload: any) {
    const towingCompany = await TransportCompany.findOne({
      vehicleRegNumber: payload.vehicleRegNumber,
      serviceType: "c6a56821",
    })
      .select("phoneNumber password")
      .lean()
      .exec();
    console.log({ payload });

    console.log({ towingCompany });

    if (!towingCompany) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Towing account not found"
      );
    }

    const password = await encryption.compareValues(
      payload.password,
      towingCompany.password
    );
    if (!password) {
      throw new HandleException(
        STATUS_CODES.UNAUTHORIZED,
        "Incorrect password"
      );
    }

    return {
      _id: towingCompany._id,
      phoneNumber: towingCompany.phoneNumber,
    };
  }

  async findTowingCompanies(payload: { tripOrder: any }) {
    const { tripOrder } = payload;

    const towingCompanies = await towingRepo.findTowingCompanies(
      tripOrder.pickUpCoordinates
    );

    towingCompanies.forEach(async (towingCompany) => {
      await towingNotificationService.notifyCompanyOfOrderRequest(
        tripOrder,
        towingCompany._id
      );
    });

    return towingCompanies;
  }

  async createOrder(tripOrder: any) {
    const towingOrder = await towingRepo.createOrder(tripOrder);
    const orderDetails = await towingRepo.getOrderDetails(towingOrder)
    return orderDetails
  }

  async getTowingServiceVehicleTypes() {
    const vehicleTypes = TransportVehicleType.find({
      serviceType: "c6a56821",
    })
      .select("vehicleType feePerKM transportCompanyPercentage photo")
      .lean()
      .exec();

    return vehicleTypes;
  }

  async setStatusToEnrouteDropOffLocation(towOrderId: string) {
    const towOrder = await towingRepo.setStatusToEnrouteDropOffLocation(
      towOrderId
    );
    await towingNotificationService.notifyCustomerofOrderStatus(
      towOrder,
      "Tow truck Enroute Drop-off location",
      "The tow truck is on the way to the drop-off location"
    );
    return towOrder;
  }

  async setStatusToArrived(towOrderId: string) {
    const towOrder = await towingRepo.setStatusToArrived(towOrderId);
    await towingNotificationService.notifyCustomerofOrderStatus(
      towOrder,
      "Truck arrived!",
      "Towing truck has arrived the pick-up location"
    );
    return towOrder;
  }

  async setStatusToStarted(towOrderId: string) {
    const towOrder = await towingRepo.setStatusToStarted(towOrderId);
    await towingNotificationService.notifyCustomerofOrderStatus(
      towOrder,
      "Towing started",
      "Your tow order has started"
    );
    return towOrder;
  }

  async arrivedDestination(towOrderId: string) {
    const towOrder = await towingRepo.arrivedDestination(towOrderId);
    await towingNotificationService.notifyCustomerofOrderStatus(
      towOrder,
      "Towing arrived",
      "Your towed vehicle is at the drop-off location"
    );
    return towOrder;
  }

  async setStatusToCompleted(towOrderId: string) {
    const towOrder = await towingRepo.setStatusToCompleted(towOrderId);
    await towingNotificationService.notifyCustomerofOrderStatus(
      towOrder,
      "Towing completed",
      "The owing order has been completed"
    );
    return towOrder;
  }

  async setStatusToCancelled(params: {
    towOrderId: string;
    customerId?: string;
    towingCompanyId?: string;
  }) {
    const { towOrderId, customerId, towingCompanyId } = params;
    const towOrder = await towingRepo.setStatusToCancelled(towOrderId);

    if (customerId) {
      await towingNotificationService.notifyOnCancelledTrip({
        towOrder,
        whoCancelled: "customer",
        userId: towOrder.towingCompany,
      });
    } else if (towingCompanyId) {
      await towingNotificationService.notifyOnCancelledTrip({
        towOrder,
        whoCancelled: "towing company",
        userId: towOrder.customer,
      });
    }

    return towOrder;
  }
}

export const towingService = new TowingService();
