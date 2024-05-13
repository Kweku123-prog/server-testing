import { Router } from "express";
import { makuController } from "../controllers/maku.controller";
import { jwtUtils } from "../../../utils";

class MakuRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }
  public initializeRoutes() {
    this.router.route('/types').get(makuController.getVehicleTypes)
    this.router.use(jwtUtils.verifyTokenMiddleware)
    this.router.route('/:tripId').get(makuController.getTripDetails)
  }
}

export const makuRoutes = new MakuRoutes()