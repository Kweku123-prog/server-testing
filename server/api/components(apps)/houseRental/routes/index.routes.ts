import { Router } from "express";
import { landlordRoutes } from "./landlord.routes";
import { propertyRoutes } from "./property.routes";

class HouseRentalRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use("/landlord", landlordRoutes.router);
    this.router.use("/property", propertyRoutes.router);
  }
}

export const houseRentalRoutes = new HouseRentalRoutes();
