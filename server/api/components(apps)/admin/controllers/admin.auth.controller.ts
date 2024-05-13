import { Request, Response } from "express";
import {
	validateSigninCredentials,
	AdminModel,
	validateSignupCredentials,
} from "../models/admin.model";
import { jwtUtils } from "../../../utils";
import { adminAuthService } from "../services/admin.auth.service";
import { STATUS_CODES } from "../../../constants";

class AdminAuthController {
	async signup(req: Request, res: Response): Promise<Response> {
		try {
			const credentials = new AdminModel(req.body);

			await validateSignupCredentials(credentials);

			await adminAuthService.signup(credentials);

			return res.status(201).json({
				error: false,
				message:
					"Account created successfully. You account is pending activation.",
			});
		} catch (error: any) {
			return res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				error: true,
				message: error.message,
			});
		}
	}

	async signin(req: Request, res: Response): Promise<Response> {
		try {
			const credentials = new AdminModel(req.body);

			await validateSigninCredentials(credentials);

			const admin = await adminAuthService.signin(credentials);

			const accessToken = jwtUtils.generateToken(admin, "1h");
			const refreshToken = jwtUtils.generateToken(admin, "14d");

			return res.status(200).json({
				message: "Authenticated successfully",
				accessToken,
				refreshToken,
			});
		} catch (error: any) {
			return res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				error: true,
				message: error.message,
			});
		}
	}
}

export const adminAuthController = new AdminAuthController();
