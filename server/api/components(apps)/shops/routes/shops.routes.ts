import { Router } from "express";
import { shopController } from "../controllers/shops.controller";
import { jwtUtils } from "../../../utils";

class ShopsRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.route(`/categories`).get(shopController.getAllCategories);
    this.router.use(jwtUtils.verifyTokenMiddleware);
    this.router.route(`/create/`).post(shopController.createShop);
    this.router.route(`/:shopId/update`).patch(shopController.updateShop);
    this.router
      .route(`/:shopId/products`)
      .get(shopController.getProductsForAshop);
    this.router.route("/types").get(shopController.getShopTypes);
    this.router
      .route("/types/:shopTypeId/categories")
      .get(shopController.getCategoriesByShopType);
    this.router.route("/search").get(shopController.searchShops)
    this.router.route("/:shopId/orders").get(shopController.getOrders);
    this.router.route("/:shopId/delete").delete(shopController.deleteShop)
    this.router.route("/food-and-grocery").get(shopController.getFoodAndGroceryShops)
  }
}

export const shopsRoutes = new ShopsRoutes();