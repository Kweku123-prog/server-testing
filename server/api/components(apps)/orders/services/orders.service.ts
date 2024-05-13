import { OrderStatus, STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { ordersNotificationService } from "../../notifications";
import { Order } from "../models/orders.models";
import { IOrder } from "../orders.interface";

class OrdersService {
  public async createOrder(payload: any) {
    try {
      const orderItems = payload.items.map((item: any) => {
        return {
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
          shop: item.shop,
        };
      });

      const order = await new Order({
        customer: payload.customer,
        items: orderItems,
        deliveryFee: payload.deliveryFee,
        deliveryAddress: payload.address,
        deliveryAddressCord: {
          coordinates: payload.coordinates,
        },
        productTotal: payload.productTotal,
        totalAmount: payload.totalPrice,
      }).save();

      return order._id;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getOrder(orderId: string): Promise<IOrder> {
    try {
      const order = await Order.findById({ _id: orderId })
        .select("-__v -updatedAt -deliveryAddressCord.type")
        .populate({ path: "items.product", select: "name photos" })
        .populate({
          path: "items.shop",
          select:
            "name  phoneNumber location.coordinates street city state country",
        })
        .populate({
          path: "customer",
          select: "phoneNumber firstName lastName",
        })
        .lean();

      if (!order) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "Order not found");
      }
      return order;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getOrderById(id: string, selectField?: string): Promise<IOrder> {
    try {
      const query = Order.findById(id);
      if (selectField) {
        query.select(selectField);
      }

      const order = await query.exec();

      if (!order) {
        throw new HandleException(
          STATUS_CODES.NOT_FOUND,
          "The order was not found and might not exist"
        );
      }
      return order;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async setStatusToProcessing(orderId: string) {
    const order = await Order.findById(orderId)
      .select("-__v -updatedAt -deliveryAddressCord.type")
      .populate({ path: "items.product", select: "name photos" })
      .populate({
        path: "items.shop",
        select:
          "name  phoneNumber location.coordinates street city state country",
      })
      .populate({
        path: "customer",
        select: "phoneNumber firstName lastName",
      })
      .exec();
    // const order = await this.getOrder(orderId);
    if (order) {
      order.status = OrderStatus.PROCESSING;
      await order.save();
      // await notificationService.orderAccepted(order);
      await ordersNotificationService.notifyCustomerOfOrderStatus(
        order,
        "Order accepted",
        "Your order has been accepted and being processed"
      );
      // console.log("order set to processing", { order });

      return order;
    }
  }

  public async setStatusToTransit(orderId: string) {
    const order = await ordersService.getOrderById(orderId, "status customer");
    if (order) {
      order.status = OrderStatus.TRANSIT;
      await order.save();
      ordersNotificationService.notifyCustomerOfOrderStatus(
        order,
        "Order picked up",
        "Your order is on the way to you"
      );
      console.log("Order now in transit", { order });
    }
  }

  public async setStatusToArrived(orderId: string) {
    const order = await ordersService.getOrderById(orderId, "status customer");
    if (order) {
      order.status = OrderStatus.ARRIVED;
      await order.save();
      ordersNotificationService.notifyCustomerOfOrderStatus(
        order,
        "Order arrived",
        "Your order has arrived at your location"
      );
    }
    console.log("order arrived");
  }

  public async setStatusToDelivered(orderId: string) {
    const order = await ordersService.getOrderById(orderId, "status customer");
    if (order) {
      order.status = OrderStatus.DELIVERED;
      await order.save();
      ordersNotificationService.notifyCustomerOfOrderStatus(
        order,
        "Order delivered",
        "Your order has been delivered"
      );
      console.log("Order delivered to customer", { order });
    }
  }

  public async setStatusToRejected(orderId: string) {
    const order = await ordersService.getOrderById(orderId, "status customer");
    if (order) {
      order.status = OrderStatus.REJECTED;
      await order.save();
      ordersNotificationService.notifyCustomerOfOrderStatus(
        order,
        "Your order was rejected",
        "View details of your rejected order"
      );
    }
  }

  public prepareOrderDataForRider(order: IOrder) {
    return {
      orderId: order._id,
      // shop: order.items.map((item) => item.shop)[0],
      shop: order.items.reduce((acc: any, item: any) => {
        acc = item.shop;
        return acc;
      }, {}),
      customer: order.customer,
      deliveryAddress: {
        address: order.deliveryAddress,
        coordinates: order.deliveryAddressCord.coordinates,
      },
    };
  }

  async assignRider(orderId: string, riderId: string) {
    const order = await ordersService.getOrderById(
      orderId,
      "rider customer status"
    );
    order.rider = riderId;
    await order.save();
    return order;
  }
}

export const ordersService = new OrdersService();
