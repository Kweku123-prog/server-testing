import { Router } from "express";
import { driversRidersController } from "../controllers/driversRidersControllers";
import { jwtUtils } from "../../../utils";
import { ridersController } from "../controllers/riders.Controllers";

class DriversRidesrRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`/signup`, driversRidersController.signup);
    this.router.post(`/login`, driversRidersController.login);

    this.router.use(jwtUtils.verifyTokenMiddleware);
    this.router.patch(
      "/:driverRiderId/rate",
      driversRidersController.rateDriverOrRider
    );
    this.router.route("/me").get(driversRidersController.getMe);
    this.router
      .route("/me/update")
      .patch(driversRidersController.updateProfile);
    this.router
      .route("/maku/trip-history")
      .get(driversRidersController.makuTripHistory);
    this.router
      .route("/maku/trip/:tripId")
      .get(driversRidersController.getmakuTripDetails);
    this.router
      .route("/messenger-service-history")
      .get(ridersController.messengerOrderHistory);
  }
}

export const driversRidesrRoutes = new DriversRidesrRoutes();
