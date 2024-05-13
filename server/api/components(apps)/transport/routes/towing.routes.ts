import { Router } from "express";

import { towingController } from "../controllers/towing.controller";

class TowingRoutes {
  public router: Router;
  
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.route("/login").post(towingController.login);
  }
}

export const towingRoutes = new TowingRoutes();
