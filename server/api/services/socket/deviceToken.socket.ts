import { Socket } from "socket.io";
import { redisClient } from "../redis.service";

export function deviceTokenEvents(socket: Socket) {
  socket.on("fcm-vendor-device-token", async (message) => {
    const { vendor: vendorId, deviceToken } = message;
    console.log({ vendorId, deviceToken });
    await redisClient.set(`device-token:${vendorId}`, deviceToken);
  });

  socket.on("fcm-customer-device-token", async (message) => {
    const { customer: customerId, deviceToken } = message;
    console.log({ customerId, deviceToken });
    await redisClient.set(`device-token:${customerId}`, deviceToken);
  });

  socket.on("fcm-rider-device-token", async (message) => {
    const { riderId, deviceToken } = message;
    console.log({ riderId, deviceToken });
    await redisClient.set(`device-token:${riderId}`, deviceToken);
  });

  socket.on("fcm-driver-device-token", async (message) => {
    const { driverId, deviceToken } = message;
    await redisClient.set(`device-token:${driverId}`, deviceToken);
  });
}
