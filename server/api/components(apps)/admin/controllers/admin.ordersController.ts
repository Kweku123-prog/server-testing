import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { adminOpsForOrdersService } from "../services/admin.orderssServices";
import { adminService } from "../services/admin.service";

class AdminOpsForOrdersController {
	public async deliveryRate(req: Request, res: Response) {
		try {
			const deliveryRate = await adminService.deliveryRate(req.body);
			res.status(STATUS_CODES.CREATED).json({
				message: "Operation succesful",
				data: deliveryRate,
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Operation failed",
				error: error.message,
			});
		}
	}

	async getOrders(req: Request, res: Response) {
		const page = parseInt(req.query.page as string) || 1;
		const status = req.query.status as string;
		try {
			const orders = await adminOpsForOrdersService.getOrders(
				page,
				status
			);
			res.status(STATUS_CODES.OK).json({
				messsge: "Found orders",
				data: { orders },
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Operation failed",
				error: error.message || "Server error",
			});
		}
	}

	async getOrderDetails(req: Request, res: Response) {
		try {
			const order = await adminOpsForOrdersService.getOrderDetails(
				req.params.orderId
			);
			res.status(STATUS_CODES.OK).json({
				message: "Fetched order",
				data: { order },
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Failed to get order",
				error: error.message || "Server error",
			});
		}
	}
}

export const adminOpsForOrdersController = new AdminOpsForOrdersController();
