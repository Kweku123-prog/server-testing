import { Socket } from "socket.io";
import { makuService } from "../../components(apps)/maku";
import { notificationService } from "../../components(apps)/notifications";
import { makuNotificationService } from "../../components(apps)/notifications/services/makuNotifications";

export function listenForMakuEvents(socket: Socket, io: any) {
  socket.on("find-nearest-drivers", async (message) => {
    const {
      pickUpCoordinates,
      pickUpAddress,
      destinationAddress,
      destinationCoordinates,
      customer,
      searchKMLimit,
      vehicleType,
    } = message;

    try {
      const drivers = await makuService.findNearestDrivers(
        pickUpCoordinates,
        pickUpAddress,
        destinationCoordinates,
        destinationAddress,
        customer,
        searchKMLimit,
        vehicleType
      );
      console.log({ nearestDrivers: drivers });
      socket.emit("found-nearest-drivers", drivers);
      socket.join(`maku:${customer}`);
    } catch (error: any) {
      socket.emit("found-nearest-drivers-error", error.message);
    }
  });

  socket.on("create-trip", async (message) => {
    try {
      const trip = await makuService.createTrip(message);
      const getTrip = await makuService.getTripDetails(trip._id);
      const room = `maku:${trip.customer}`;
      socket.join(room);
      io.to(room).emit("created-trip", getTrip);
    } catch (error: any) {
      socket.emit("create-trip-error", error.message);
      console.log("error creating trip", error.message);
    }
  });

  socket.on("arrived-pickup-location", async (message) => {
    try {
      const trip: any = await makuService.driverArrivedLocation(message.tripId);
      await notificationService.notifyCustomerOnDrivalArrival(trip.customer, {
        _id: trip._id,
        status: trip.status,
      });
    } catch (error: any) {
      socket.emit("arrived-pickup-location-error", error.message);
    }
  });

  socket.on("start-trip", async (message) => {
    try {
      const trip = await makuService.startTrip(message.tripId);
      await makuNotificationService.notifyCustomerOfTripStatus(
        trip,
        "Trip started",
        "We hope you enjoy your ride"
      );
    } catch (error: any) {
      socket.emit("start-trip-error", error.message);
      console.log("error starting trip", error.message);
    }
  });

  socket.on("complete-trip", async (message) => {
    try {
      const trip = await makuService.completeTrip(message.tripId);
      console.log({ trip });
      await makuNotificationService.notifyCustomerOfTripStatus(
        trip,
        "Trip completed!",
        "We hope you did enjoy your ride"
      );
    } catch (error: any) {
      socket.emit("complete-trip-error", error.message);
      console.log("error completing trip", error.message);
    }
  });

  socket.on("cancel-trip", async (message) => {
    try {
      const trip: any = await makuService.cancelTrip(message.tripId);
      if (message.driverId) {
        await notificationService.notifyOnCancelledTrip(
          trip?.customer,
          "driver",
          {
            _id: trip._id,
            status: trip.status,
          }
        );
      } else if (message.customerId) {
        notificationService.notifyOnCancelledTrip(trip?.driver, "passenger", {
          _id: trip._id,
          status: trip.status,
        });
      }
    } catch (error: any) {
      socket.emit("cancel-trip-error", error.message);
      console.log("error starting trip", error.message);
    }
  });
}
