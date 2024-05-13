import { Router } from "express";
import { adminRidersController } from "../controllers/admin.ridersController";

class AdminOpsRidersRoutes {
	public router: Router;

	constructor() {
		this.router = Router();
		this.initializeRoutes();
	}

	private async initializeRoutes() {
		this.router
			.route("/:riderId/approve")
			.patch(adminRidersController.approveRider);

		this.router
			.route("/:riderId/reject")
			.patch(adminRidersController.rejectRider);

		this.router.route("/").get(adminRidersController.getRiders);

		this.router
			.route("/:riderId")
			.get(adminRidersController.getRiderDetails);

		this.router.route("/:riderId").patch(adminRidersController.updateRider);

		this.router
			.route("/:riderId")
			.delete(adminRidersController.deleteRider);
	}
}

export const adminOpsRidersRoutes = new AdminOpsRidersRoutes();
