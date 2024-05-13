import { Request, Response } from "express";
import { ordersService } from "../services/orders.service";
import { STATUS_CODES } from "../../../constants";
import { handleErrorResponse } from "../../../utils";
import { validateOrders } from "../validators/orders.validation";

class OrdersController {
  async createOrder(req: Request, res: Response) {
    try {
      const customerId = (req as any).user._id;
      await validateOrders.createOrder(req.body);
      const order = await ordersService.createOrder(req.body);
      res.status(STATUS_CODES.OK).json({
        message: "Created order",
        data: {
          order,
        },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getOrder(req: Request, res: Response) {
    try {
      const order = await ordersService.getOrder(req.params.orderId);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched order",
        data: {
          order,
        },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
}

export const ordersController = new OrdersController();
