import { Router } from "express";
import { adminAuthController } from "../controllers/admin.auth.controller";

class AdminAuthRouter {
	public router = Router();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.route("/signin").post(adminAuthController.signin);
		this.router.route("/signup").post(adminAuthController.signup);
	}
}

export const adminAuthRouter = new AdminAuthRouter();
