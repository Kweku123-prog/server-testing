import { Router } from "express";
import { earningController } from "../controllers/earnings.controller";
import { jwtUtils } from "../../../utils";

class EarningsRoutes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.initializeRoutes()
  }
  private async initializeRoutes() {
    this.router.use(jwtUtils.verifyTokenMiddleware)
    this.router.route("/").get(earningController.getEarnings);
  }
}

export const earningsRoutes = new EarningsRoutes();
