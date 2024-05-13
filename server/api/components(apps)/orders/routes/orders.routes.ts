import { Router } from 'express'

import { jwtUtils } from "../../../utils";
import { ordersController } from "../controllers/orders.controller";

class OrdersRoutes {
    public router = Router();
  
    constructor() {
      this.initializeRoutes();
    }
  
    public initializeRoutes() {
  
      this.router.use(jwtUtils.verifyTokenMiddleware)
      this.router.route(`/create`).post(ordersController.createOrder);
      this.router.route(`/:orderId`).get(ordersController.getOrder);
    }
  }

  export const ordersRoutes = new OrdersRoutes()