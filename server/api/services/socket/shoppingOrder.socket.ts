import { Socket } from "socket.io";
import { ordersService } from "../../components(apps)/orders";
import {
  notificationService,
  ordersNotificationService,
} from "../../components(apps)/notifications";
import { findClosestDriverOrRider } from "../geospatial.services";

export function listenForShoppingOrderEvents(socket: Socket) {
  socket.on("create-order", async (message) => {
    console.log({ message });
    try {
      const order = await ordersService.createOrder(message);
      console.log({ order });
      message = {
        _id: order,
        ...message,
      };
      console.log({ message });
      await notificationService.vendorHandleOrderRequest(socket, message);
      socket.emit("created-order", order);
    } catch (error) {
      console.error({ error });
    }
  });

  socket.on("order-accepted", async (message) => {
    console.log({ acceptedOrderId: message.orderId });
    try {
      const order = await ordersService.setStatusToProcessing(message.orderId);
      if (order) {
        const orderData = ordersService.prepareOrderDataForRider(order);

        const shopCoordinates = order?.items.reduce((acc: any, item: any) => {
          acc = item.shop.location.coordinates;
          return acc;
        }, {});

        const riders = await findClosestDriverOrRider(
          shopCoordinates,
          "rider",
          10.5
        );
        console.log({ riders });

        riders.forEach((rider) => {
          notificationService.notifyRiderOfOrder(rider._id, orderData);
        });
      }
    } catch (error: any) {
      console.error(error);
    }
  });

  socket.on("order-rejected", async (message) => {
    try {
      ordersService.setStatusToRejected(message.orderId);
    } catch (error: any) {
      socket.emit("order-rejected-error", error.message);
    }
  });

  socket.on("assign-rider", async (message) => {
    const { orderId, riderId } = message;
    try {
      const order = await ordersService.assignRider(orderId, riderId);
      console.log({ order });
      await ordersNotificationService.notifyCustomerOfOrderStatus(
        order,
        "Order Assigned",
        "A rider has accepted and is assigned to your order"
      );
    } catch (error: any) {
      socket.emit("assign-rider-error", error.message);
    }
  });

  socket.on("order-in-transit", async (message) => {
    const { orderId } = message;
    console.log({ orderId });
    await ordersService.setStatusToTransit(orderId);
    try {
    } catch (error: any) {
      socket.emit("order-in-transit-error", error.message);
    }
  });

  socket.on("order-arrived", async (message) => {
    const { orderId } = message;
    await ordersService.setStatusToArrived(orderId);
    try {
    } catch (error: any) {
      socket.emit("order-arrived-error", error.message);
    }
  });

  socket.on("order-delivered", async (message) => {
    const { orderId } = message;
    await ordersService.setStatusToDelivered(orderId);
    try {
    } catch (error: any) {
      socket.emit("order-delivered-error", error.message);
    }
  });
}
