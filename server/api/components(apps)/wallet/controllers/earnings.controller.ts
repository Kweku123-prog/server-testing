import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { earningsRepo } from "../repository/earnings.repo";
import { handleErrorResponse } from "../../../utils";

class EarningsController {
  async getEarnings(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) | 1;
    try {
      const user = (req as any).user._id;
      const earnings = await earningsRepo.getEarnings(user, page);
      res.status(STATUS_CODES.OK).json({
        message: "Success",
        data: { earnings },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
}

export const earningController = new EarningsController()
