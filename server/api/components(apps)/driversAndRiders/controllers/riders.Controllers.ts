import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { ridersService } from "../services/riders.service";

class RidersController {
  async messengerOrderHistory(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
      const riderId = (req as any).user._id;

      const messengerOrders = await ridersService.messengerOrderHistory(
        riderId,
        page
      );
      res.status(STATUS_CODES.OK).json({
        message: "Success",
        data: { messengerOrders },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed",
        error: error.message,
      });
    }
  }
}

export const ridersController = new RidersController();
