import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { adminOpsForMessengerService } from "../services/admin.messengerService.service";

class AdminOpsForMessengerController {
	async createPackageType(req: Request, res: Response) {
		try {
			const packageType =
				await adminOpsForMessengerService.createPackageType(req.body);
			res.status(STATUS_CODES.CREATED).json({
				message: "Success",
				data: { packageType },
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Operation failed",
				error: error.message,
			});
		}
	}
}

export const adminOpsForMessengerController =
	new AdminOpsForMessengerController();
