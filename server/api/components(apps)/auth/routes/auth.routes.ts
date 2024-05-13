import { Router } from "express";
import { verifyController } from "../controllers/verify.controller";
import { passwordMgmtController } from "../controllers/passwordMgmt.controller";
import { jwtUtils } from "../../../utils";
import { authController } from "../controllers/auth.controller";

class AuthRoutes {
	public router = Router();

	constructor() {
		this.initializeRoutes();
	}

	public initializeRoutes(): void {
		this.router
			.route("/verify/phone-number/send-code")
			.post(verifyController.sendVerificationCode);

		this.router
			.route("/verify/phone-number/check-code")
			.post(verifyController.checkVerificationCode);

		this.router
			.route("/password/reset")
			.patch(passwordMgmtController.resetPassword);

		this.router
			.route("/refresh-access-token")
			.post(authController.refreshAccessToken);

		this.router.use(jwtUtils.verifyTokenMiddleware);
		this.router
			.route("/password/change")
			.patch(passwordMgmtController.changePassword);
	}
}

export const authRoutes = new AuthRoutes();
