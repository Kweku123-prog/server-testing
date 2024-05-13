import { Socket } from "socket.io";
import { messengerService } from "../../components(apps)/messenger";

export function listenToMessengerService(socket: Socket) {
  socket.on("create-messenger-service-order", async (message: any) => {
    const { order, searchKMLimit } = message;
    try {
      const messengerOrder = await messengerService.createOrder(
        order,
        searchKMLimit
      );
      socket.emit("created-messenger-service-order", messengerOrder);
    } catch (error: any) {
      socket.emit("create-messenger-service-order-error", error.message);
    }
  });

  socket.on("assign-rider-to-messenger-order", async function (message: any) {
    const { orderId, riderId } = message;
    try {
      await messengerService.assignRider(orderId, riderId);
    } catch (error: any) {
      socket.emit("assign-rider-to-messenger-order-error", error.message);
    }
  });

  socket.on("messenger-order-picked-up", async (message) => {
    try {
      const { orderId } = message;
      await messengerService.setStatusToPickedUp(orderId);
    } catch (error: any) {
      socket.emit("messenger-order-picked-up-error", error.message);
    }
  });

  socket.on("messenger-order-arrived", async (message) => {
    const { orderId } = message;
    try {
      await messengerService.setStatusToArrived(orderId);
    } catch (error: any) {
      socket.emit("messenger-order-arrived-error", error.message);
    }
  });

  socket.on("messenger-order-delivered", async (message) => {
    const { orderId } = message;
    try {
      await messengerService.setStatusToDelivered(orderId);
    } catch (error: any) {
      socket.emit("messenger-order-delivered-error", error.message);
    }
  });

  socket.on("cancel-messenger-order", async (message) => {
    const { orderId, customerId, riderId } = message;
    try {
      await messengerService.cancelOrder({ orderId, customerId, riderId });
      console.log("Order cancelled");
    } catch (error: any) {
      socket.emit("cancel-messenger-order-error", error.message);
    }
  });
}
