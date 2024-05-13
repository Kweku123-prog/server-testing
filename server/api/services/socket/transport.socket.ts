import { Socket } from "socket.io";
import {
  towingRepo,
  towingService,
  transportRepo,
  transportService,
} from "../../components(apps)/transport";
import { redisClient } from "../redis.service";

function listenForTransportServiceEvents(socket: Socket, io: any) {
  socket.on("update-transport-company-location", async (message: any) => {
    // This function upates all transport company location, INLCUDING
    // towing companies.
    try {
      const { transportCompanyId, coordinates } = message;
      transportRepo.updateLocation({ transportCompanyId, coordinates });
    } catch (error: any) {
      socket.emit("update-transport-company-location-error", error.message);
    }
  });

  socket.on("fcm-transport-company-device-token", async (message) => {
    const { transportCompanyId, deviceToken } = message;
    await redisClient.set(`device-token:${transportCompanyId}`, deviceToken);
  });

  socket.on("fcm-towing-company-device-token", async (message) => {
    const { towingCompanyId, deviceToken } = message;
    console.log({ towingCompanyId, deviceToken });

    await redisClient.set(`device-token:${towingCompanyId}`, deviceToken);
  });

  socket.on("transport-company-start-working", async (message) => {
    try {
      await transportRepo.startWorking(message.transportCompanyId);
    } catch (error: any) {
      socket.emit("transport-company-start-working-error", error.message);
    }
  });

  socket.on("transport-company-stop-working", async (message) => {
    try {
      await transportRepo.stopWorking(message.transportCompanyId);
    } catch (error: any) {
      socket.emit("transport-company-stop-working-error", error.message);
    }
  });

  socket.on("find-transport-companies", async (message: any) => {
    const { tripOrder } = message;
    try {
      const transportCompanies = await transportService.findTransportCompanies({
        tripOrder,
      });
      socket.emit("found-transport-companies", transportCompanies);
      const room = `transportOrder:${tripOrder.customer}`;
      socket.join(room);
    } catch (error: any) {
      socket.emit("find-transport-companies-error", error.message);
    }
  });

  socket.on("find-tow-companies", async (message: any) => {
    const { tripOrder } = message;

    try {
      const towCompanies = await towingService.findTowingCompanies({
        tripOrder,
      });
      const room = `towingOrder:${tripOrder.customer}`;
      socket.join(room);

      console.log({ towCompanies: JSON.stringify(towCompanies) });
      socket.emit("found-tow-companies", towCompanies);
    } catch (error: any) {
      socket.emit("find-tow-companies-error");
    }
  });

  socket.on("create-towing-order", async (message) => {
    try {
      const { tripOrder } = message;
      const towingOrder = await towingService.createOrder(tripOrder);
      const room = `towingOrder:${tripOrder.customer}`;
      socket.join(room);
      io.to(room).emit("created-towing-order", towingOrder);
    } catch (error: any) {
      socket.emit("create-towing-order-error", error);
    }
  });

  socket.on("create-transport-order", async (message) => {
    try {
      const { tripOrder } = message;
      const transportOrder = await transportService.createOrder(
        tripOrder
      );
      const room = `transportOrder:${tripOrder.customer}`;
      socket.join(room);
      io.to(room).emit("created-transport-order", transportOrder);
    } catch (error: any) {
      socket.emit("create-transport-order-error", error);
    }
  });

  socket.on("towing-company-enroute-dropoff-location", async (message) => {
    try {
      const towingTrip = await towingService.setStatusToEnrouteDropOffLocation(
        message.towOrderId
      );
      socket.emit("towing-company-enroute", towingTrip);
    } catch (error: any) {
      socket.emit("towing-company-enroute-dropoff-location-error", error.message);
    }
  });

  socket.on("towing-company-arrived-location", async (message) => {
    try {
      const towingTrip = await towingService.setStatusToArrived(
        message.towOrderId
      );
      socket.emit("towing-company-arrived", towingTrip);
    } catch (error: any) {
      socket.emit("towing-company-arrived-location-error", error.message);
    }
  });

  socket.on("start-towing-trip", async (message) => {
    try {
      const towingTrip = await towingService.setStatusToStarted(
        message.towOrderId
      );
      socket.emit("started-towing-trip", towingTrip);
    } catch (error: any) {
      socket.emit("start-towing-trip-error", error.message);
    }
  });

  socket.on("towing-company-arrived-destination", async (message) => {
    try {
      const towingTrip = await towingService.arrivedDestination(
        message.towOrderId
      );
      socket.emit("towing-company-arrived-dropoff-destination", towingTrip);
    } catch (error: any) {
      socket.emit("towing-company-arrived-destinationt-error", error.message);
    }
  });

  socket.on("complete-towing-trip", async (message) => {
    try {
      const towingTrip = await towingService.setStatusToCompleted(
        message.towOrderId
      );
      socket.emit("completed-towing-trip", towingTrip);
    } catch (error: any) {
      socket.emit("complete-towing-trip-error", error.message);
    }
  });

  socket.on("cancel-towing-trip", async (message) => {
    const { towOrderId, customerId, towingCompanyId } = message;
    try {
      const towingTrip = await towingService.setStatusToCancelled({
        towOrderId,
        customerId,
        towingCompanyId,
      });
      socket.emit("cancelled-towing-trip", towingTrip);
    } catch (error: any) {
      socket.emit("cancel-towing-trip-error", error.message);
    }
  });

  //  Transport (excluding towing service)
  socket.on("transport-company-enroute-dropoff-location", async (message) => {
    console.log({ message });
    try {
      const transportTrip =
        await transportService.setStatusToEnrouteDropOffLocatioon(
          message.transportOrderId
        );
      socket.emit("transport-company-enroute-dropff", transportTrip);
    } catch (error: any) {
      socket.emit("transport-company-enroute-dropoff-location-error");
    }
  });

  socket.on("transport-company-arrived-location", async (message) => {
    try {
      const transportTrip = await transportService.setStatusToArrived(
        message.transportOrderId
      );
      socket.emit("transport-company-arrived", transportTrip);
    } catch (error: any) {
      socket.emit("transport-company-arrived-location-error");
    }
  });

  socket.on("start-transport-trip", async (message) => {
    try {
      const transportTrip = await transportService.setStatusToStarted(
        message.transportOrderId
      );
      socket.emit("started-transport-trip", transportTrip);
    } catch (error: any) {
      socket.emit("start-transport-trip-error");
    }
  });

  socket.on("transport-company-arrived-destination", async (message) => {
    console.log({ message });
    try {
      const transportTrip = await transportService.arrivedDestination(
        message.transportOrderId
      );
      socket.emit(
        "transport-company-arrived-dropoff-destination",
        transportTrip
      );
    } catch (error: any) {
      socket.emit("towing-company-arrived-destination-error", error.message);
    }
  });

  socket.on("complete-transport-trip", async (message) => {
    try {
      const transportTrip = await transportService.setStatusToCompleted(
        message.transportOrderId
      );
      socket.emit("completed-transport-trip", transportTrip);
    } catch (error: any) {
      socket.emit("complete-transport-trip-error");
    }
  });

  socket.on("cancel-transport-trip", async (message) => {
    const { transportOrderId, customerId, transportCompanyId } = message;
    try {
      const transportTrip = await transportService.setStatusToCancelled({
        transportOrderId,
        customerId,
        transportCompanyId,
      });
      socket.emit("cancelled-transport-trip", transportTrip);
    } catch (error: any) {
      socket.emit("cancel-transport-trip-error");
    }
  });
}

export { listenForTransportServiceEvents };
