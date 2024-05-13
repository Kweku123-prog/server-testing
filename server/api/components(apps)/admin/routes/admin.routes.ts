import { Router } from "express";
import { apiKeyMiddleware } from "../../../middleware";

import { adminOpsForMessengerController } from "../controllers/admin.messengerService.controller";
import { adminOpsCustomersRoutes } from "./customers.routes";
import { adminOpsMakuRoutes } from "./maku.routes";
import { adminOpsShopsRoutes } from "./shops.routes";
import { adminOpsVendorsRoutes } from "./vendors.routes";
import { adminOpsOrdersRoutes } from "./orders.routes";
import { adminOpsDriversRoutes } from "./drivers.routes";
import { adminOpsRidersRoutes } from "./riders.routes";
import { adminOpsTransportServiceRoutes } from "./transport.routes";
import { adminOpsProductsRoute } from "./products.routes";
import { adminAuthRouter } from "./admin.auth.router";

class AdminRoutes {
	public router = Router();

	constructor() {
		this.initializeRoutes();
	}

	public initializeRoutes() {
		// this.router.use(apiKeyMiddleware);

		this.router.use("/auth", adminAuthRouter.router);

		// 
		this.router.use("/maku", adminOpsMakuRoutes.router);
		this.router.use("/shops", adminOpsShopsRoutes.router);
		this.router.use("/customers", adminOpsCustomersRoutes.router);
		this.router.use("/vendors", adminOpsVendorsRoutes.router);
		this.router.use("/orders", adminOpsOrdersRoutes.router);
		this.router.use("/drivers", adminOpsDriversRoutes.router);
		this.router.use("/riders", adminOpsRidersRoutes.router);
		this.router.use("/transport", adminOpsTransportServiceRoutes.router);
		this.router.use("/products", adminOpsProductsRoute.router);

		// Messenger service
		this.router
			.route("/messenger-service/create-package-type")
			.post(adminOpsForMessengerController.createPackageType);
	}
}

export const adminRoutes = new AdminRoutes();
