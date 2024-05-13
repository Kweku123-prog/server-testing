import { Router } from "express";
import { adminOpsForOrdersController } from "../controllers/admin.ordersController";
import { adminController } from "../controllers/admin.controller";
import { adminTransportServiceController } from "../controllers/admin.transportController";

class AdminOpsTransportServiceRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router
      .route("/create-service-type")
      .post(adminTransportServiceController.createTransportServiceType);

    this.router
      .route("/create-vehicle-type")
      .post(adminTransportServiceController.createTransportVehicleType);

    this.router
      .route("/service-types")
      .get(adminTransportServiceController.getServiceTypes);

    this.router
      .route("/service-types/:serviceTypeId/vehicle-types")
      .get(adminTransportServiceController.getVehiclesByServiceType);

    this.router
      .route("/companies")
      .get(adminTransportServiceController.getCompanies);

    this.router
      .route("/companies/:companyId")
      .get(adminTransportServiceController.getCompanyDetails);

    this.router
      .route("/airport")
      .post(adminTransportServiceController.addAirport);

    this.router
      .route("/airport")
      .get(adminTransportServiceController.getAllAirports);
  }
}

export const adminOpsTransportServiceRoutes =
  new AdminOpsTransportServiceRoutes();
