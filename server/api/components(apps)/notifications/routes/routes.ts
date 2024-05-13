import { Router } from "express";
import { notificationsController } from "../controllers/notification.controller";
import { jwtUtils } from "../../../utils";

class NotificationsRoute {
  public router = Router();
  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.use(jwtUtils.verifyTokenMiddleware)
    this.router
      .route("/")
      .get(notificationsController.getUserNotifications);
  }
}

export const notificationsRoutes = new NotificationsRoute();