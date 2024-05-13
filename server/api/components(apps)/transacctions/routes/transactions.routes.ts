import { Router } from "express";
import { transactionsController } from "../controllers/transactions.controller";
import { jwtUtils } from "../../../utils";

class TransactionsRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router
      .route("/verify-payment")
      .get(transactionsController.verifyPayment);

    this.router.use(jwtUtils.verifyTokenMiddleware);
    this.router.route("/").get(transactionsController.getTransactionsForUser);
  }
}

export const transactionsRoutes = new TransactionsRoutes();
