import { Router } from "express";
import { adminController } from "../controllers/admin.controller";

class AdminOpsShopsRoutes {
  public router: Router;
  
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router.route("/create-shop-type").post(adminController.createShopType);
    this.router
      .route(`/add-shop-category/:shopTypeId`)
      .post(adminController.addcategory);
    this.router
      .route("/update-shop-type/:shopTypeId")
      .patch(adminController.updateShopType);
    this.router
      .route("/update-shop-category/:categoryId")
      .patch(adminController.updateCategory);
  }
}

export const adminOpsShopsRoutes = new AdminOpsShopsRoutes();
