import { Router } from "express";
import { transportController } from "../controllers/transport.controller";
import { jwtUtils } from "../../../utils";
import { towingController } from "../controllers/towing.controller";

class TransportRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.route("/create-company").post(transportController.create);
    this.router.route("/login").post(transportController.login);

    this.router
      .route("/service-types")
      .get(transportController.getServiceTypes);
    this.router
      .route("/service-types/:serviceTypeId/vehicle-types")
      .get(transportController.getVehiclesByServiceType);
    this.router
      .route("/towing/vehicle-types")
      .get(towingController.getTowingServiceVehicleTypes);

    this.router.use(jwtUtils.verifyTokenMiddleware);

    this.router.route("/me").get(transportController.getMe);
    this.router.route("/me/update").patch(transportController.updateProfile);

    /* Drivers and vehicle - Deprecated
    this.router.route("/add-vehicle").patch(transportController.addVehicle);
    this.router.route("/add-driver").post(transportController.addDriver);
    this.router
      .route("/drivers")
      .get(transportController.getTransportCompanyDrivers);
    this.router
      .route("/drivers/:driverId")
      .get(transportController.getTransportCompanyDriver);
    this.router
      .route("/drivers/:driverId")
      .patch(transportController.updateDriver);
    this.router
      .route("/drivers/:driverId")
      .delete(transportController.deleteDriver);

    */

    this.router.route("/tow-order").post(towingController.createTowOrder);
    this.router
      .route("/trip-order")
      .post(transportController.createTransportOrder);
    this.router
      .route("/company/trip-orders")
      .get(transportController.getTransportTripOrders);

    this.router
      .route("/company/tow-orders")
      .get(towingController.getOrdersHistoryForCompany);
    this.router
      .route("/tow-orders/:orderId")
      .get(towingController.getOrderdetails);

    this.router.route("/airports").get(transportController.getAirports);
  }
}

export const transportRoutes = new TransportRoutes();
