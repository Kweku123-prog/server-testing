import { Router } from "express";
import { adminOpsForOrdersController } from "../controllers/admin.ordersController";
import { adminDriversController } from "../controllers/admin.driversController";

class AdminOpsDriversRoutes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router
      .route("/:driverId/approve")
      .patch(adminDriversController.approveDriver);
    this.router
      .route("/:driverId/reject")
      .patch(adminDriversController.reject);

    this.router.route("/").get(adminDriversController.getDrivers);

    this.router
      .route("/:driverId")
      .get(adminDriversController.getDriverDetails);

    this.router.route("/:driverId").patch(adminDriversController.updateDriver);

    this.router.route("/:driverId").delete(adminDriversController.deleteDriver);
  }
}

export const adminOpsDriversRoutes = new AdminOpsDriversRoutes();
