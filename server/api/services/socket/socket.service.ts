import { Server } from "http";

const socketIO = require("socket.io");
import { Socket } from "socket.io";

import { redisClient } from "../redis.service";
import { driverRiderService } from "../../components(apps)/driversAndRiders";
import { walletService } from "../../components(apps)/wallet";
import { listenForTransportServiceEvents } from "./transport.socket";
import { listenForMakuEvents } from "./maku.socket";
import { listenForShoppingOrderEvents } from "./shoppingOrder.socket";
import { deviceTokenEvents } from "./deviceToken.socket";

class WebSocket {
  private io: Socket;

  constructor(server: Server) {
    this.io = socketIO(server);
  }

  public connectSocket() {
    this.io.on("connection", (socket: Socket) => {
      console.log("User connected");
      const clientId = socket.id;
      this.listenForEvents(socket, clientId);

      socket.on("disconnect", async () => {
        console.log("User disconnected");
        const driverId = await redisClient.get(`socketId:${clientId}`);
        driverRiderService.setAvailablity(driverId, false);
        redisClient.delete(`socketId:${clientId}`);
      });
    });
  }

  private listenForEvents(socket: Socket, clientId: string) {
    listenForTransportServiceEvents(socket, this.io);
    listenForMakuEvents(socket, this.io);
    listenForShoppingOrderEvents(socket);
    deviceTokenEvents(socket);

    socket.on("driver-start-working", (message) => {
      try {
        driverRiderService.setAvailablity(message.id, true);
        redisClient.set(`socketId:${clientId}`, message.id);
      } catch (error: any) {
        socket.emit("driver-start-working-error", error.message);
      }
    });

    socket.on("driver-stop-working", (message) => {
      try {
        driverRiderService.setAvailablity(message.id, false);
        redisClient.delete(`socketId:${clientId}`);
      } catch (error: any) {
        socket.emit("driver-stop-working-error", error.message);
      }
    });

    socket.on("update-driver-rider-location", async (message) => {
      const { driverId, coordinates } = message;
      // console.log({ driverId, coordinates });
      try {
        await driverRiderService.updateLocation(driverId, coordinates);
      } catch (error) {
        console.log({ error });
        socket.emit("update-driver-rider-location-error", error, message);
      }
    });

    socket.on("get-wallet-balance", async (message: any) => {
      try {
        const walletBalance = await walletService.getWalletBalanceByOwnerId(
          message.ownerId
        );
        socket.emit("wallet-balance", walletBalance);
      } catch (error: any) {
        socket.emit("get-wallet-balance-error", error.message);
      }
    });
  }
}

export { WebSocket };
