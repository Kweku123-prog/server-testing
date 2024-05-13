import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { messengerRepo } from "../repository/messenger.repo";
import { handleErrorResponse } from "../../../utils";

class MessengerConteoller {
  async getOrderDetails(req: Request, res: Response) {
    try {
      const messengerOrder = await messengerRepo.getOrder(req.params.orderId);
      res.status(STATUS_CODES.OK).json({
        message: "Success",
        data: messengerOrder,
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
}

export const messengerController = new MessengerConteoller();
