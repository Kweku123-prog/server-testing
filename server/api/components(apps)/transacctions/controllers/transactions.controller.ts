import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { transactionsRepo } from "../repository/transactions.repo";
import { handleErrorResponse } from "../../../utils";
import { transactionService } from "../services/transactions.service";

class TransactionsController {
  async getTransactionsForUser(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
      const userId = (req as any).user._id;
      const transactions = await transactionsRepo.getTransactionForUser(
        userId,
        page
      );
      res.status(STATUS_CODES.OK).json({
        message: "Success",
        data: { transactions },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async verifyPayment(req: Request, res: Response) {
    try {
      await transactionService.verifyPayment(req.body);
      res.sendStatus(STATUS_CODES.NO_CONTENT);
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
}

export const transactionsController = new TransactionsController();
