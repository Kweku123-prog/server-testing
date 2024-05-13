import { Router } from "express";
import { adminController } from "../controllers/admin.controller";

class AdminOpsMakuRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router.route("/vehicle-type").post(adminController.createVehicleType);
    this.router
      .route("/vehicle-type/:vehicleTypeId")
      .patch(adminController.updateVehicleType);
  }
}

export const adminOpsMakuRoutes = new AdminOpsMakuRoutes();
