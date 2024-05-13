import { Router } from "express";
import { adminOpsForOrdersController } from "../controllers/admin.ordersController";

class AdminOpsOrdersRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router.route("/").get(adminOpsForOrdersController.getOrders);
    this.router
      .route("/:orderId")
      .get(adminOpsForOrdersController.getOrderDetails);
    this.router
      .route("/delivery-rate")
      .post(adminOpsForOrdersController.deliveryRate);
  }
}

export const adminOpsOrdersRoutes = new AdminOpsOrdersRoutes();
