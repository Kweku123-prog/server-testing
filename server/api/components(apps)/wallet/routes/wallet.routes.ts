import { Router } from "express";
import { jwtUtils } from "../../../utils";

import { walletController } from "../controllers/wallet.controller";

class WalletRoutes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }
  private async initializeRoutes() {
    this.router.use(jwtUtils.verifyTokenMiddleware);
    this.router
      .route("/add-withdrawal-details")
      .patch(walletController.addWithDrawalDetails);
    this.router
      .route("/withdrawal-details")
      .get(walletController.getWithdrawaldetails);
  }
}

export const walletRoutes = new WalletRoutes();
