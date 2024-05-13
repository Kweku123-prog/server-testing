import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Order } from "../../orders";

class AdminOpsForOrdersService {
  async getOrders(page: number, status?: string) {
    const query: { status?: string } = {};

    if (status) {
      query.status = status;
    }

    const limit = 15;
    const options = {
      skip: (page - 1) * limit,
      limit,
      select: "_id items.shop totalAmount status",
      populate: [
        { path: "rider", select: "firstName lastName" },
        { path: "customer", select: "firstName lastName" },
      ],
      sort: { createdAt: -1 },
    };

    const totalDocs = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    var docs = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .select(options.select)
      .populate(options.populate)
      .lean()
      .exec();

    const orders = {
      docs,
      totalDocs,
      limit,
      totalPages,
      page,
      hasNextPage,
      hasPrevPage
    };
    return orders;
  }

  async getOrderDetails(orderId: string) {
    const order = await Order.findById(orderId)
      .select("-__v -updatedAt")
      .populate({
        path: "customer",
        select: "firstName lastName phoneNumber email profilePhoto",
      })
      .populate({
        path: "rider",
        select: "firstName lastName phoneNumber photo",
      })
      .populate({
        path: "items.shop",
        select: "name email phoneNumber",
      })

      .populate({
        path: "items.product",
        select: "name photos",
      })
      .lean();

    if (!order) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Order not found");
    }

    return order;
  }
}

export const adminOpsForOrdersService = new AdminOpsForOrdersService();
