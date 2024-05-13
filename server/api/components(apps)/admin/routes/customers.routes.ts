import { Router } from "express";
import { adminCustomerController } from "../controllers/admin.customers.controller";

class AdminOpsCustomersRoutes {
	public router: Router;

	constructor() {
		this.router = Router();
		this.initializeRoutes();
	}

	private async initializeRoutes() {
		this.router.route("/").get(adminCustomerController.getAll);

		this.router
			.route("/:id")
			.get(adminCustomerController.get)
			.patch(adminCustomerController.updateAccountStatus);

		this.router.route("/:id/delete").delete(adminCustomerController.delete);
		this.router
			.route("/:id/maku/trips")
			.get(adminCustomerController.getCustomerMakuTrips);

		this.router
			.route("/maku/trip/:id")
			.get(adminCustomerController.getSingleMakuTrip);
	}
}

export const adminOpsCustomersRoutes = new AdminOpsCustomersRoutes();
