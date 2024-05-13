import { Request, Response } from "express";
import { walletRepo } from "../repository/wallet.repo";
import { STATUS_CODES } from "../../../constants";
import { handleErrorResponse } from "../../../utils";
import { walletService } from "../services/wallet.service";

class WalletController {
  async addWithDrawalDetails(req: Request, res: Response) {
    try {
      const user = (req as any).user._id;
      const wallet = await walletService.createTransferRecipient(user, req.body)
      res.status(STATUS_CODES.OK).json({
        message: "Success",
        data: { wallet },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getWithdrawaldetails(req: Request, res: Response) {
    try {
      const user = (req as any).user._id;
      const withdrawalDetails = await walletRepo.getWithdrawalDetails(user);
      res.status(STATUS_CODES.OK).json({
        message: "Success",
        data: withdrawalDetails,
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
}

export const walletController = new WalletController();
