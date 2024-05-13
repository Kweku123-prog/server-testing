import { Router } from "express";
import { jwtUtils } from "../../../utils";
import { messengerController } from "../controllers/messenger.controller";

class MessengerServiceRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {

    this.router.use(jwtUtils.verifyTokenMiddleware);
    this.router.route("/orders/:orderId").get(messengerController.getOrderDetails);
  }
}

export const messengerServiceRoutes = new MessengerServiceRoutes();
