import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { adminDriversService } from "../services/admin.drivers.service";

class AdminDriversController {
	async approveDriver(req: Request, res: Response) {
		try {
			await adminDriversService.approveDriver(req.params.driverId);
			res.status(STATUS_CODES.OK).json({
				message: "Success",
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Operation failed",
				error: error.message || "Server error",
			});
		}
	}

	async reject(req: Request, res: Response) {
		try {
			await adminDriversService.rejectDriver(req.params.driverId);
			res.status(STATUS_CODES.OK).json({
				message: "Success",
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Operation failed",
				error: error.message || "Server error",
			});
		}
	}

	async getDrivers(req: Request, res: Response) {
		const page = parseInt(req.query.page as string) || 1;
		const approvalStatus = req.query.approval_status as string;

		try {
			const drivers = await adminDriversService.getDrivers(
				page,
				approvalStatus
			);
			res.status(STATUS_CODES.OK).json({
				message: "Fetched drivers",
				data: { drivers },
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Error getting drivers",
				error: error.message || "Server error",
			});
		}
	}

	async getDriverDetails(req: Request, res: Response) {
		try {
			const driver = await adminDriversService.getDriverDetails(
				req.params.driverId
			);
			res.status(STATUS_CODES.OK).json({
				message: "Fetched driver",
				data: { driver },
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Error getting driver",
				error: error.message || "Server error",
			});
		}
	}

	async updateDriver(req: Request, res: Response) {
		try {
			const driver = await adminDriversService.updateDriver(
				req.params.driverId,
				req.body
			);
			res.status(STATUS_CODES.OK).json({
				message: "Updated driver",
				data: { driver },
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Error updating driver",
				error: error.message || "Server error",
			});
		}
	}

	async deleteDriver(req: Request, res: Response) {
		try {
			await adminDriversService.deleteDriver(req.params.driverId);
			res.status(STATUS_CODES.OK).json({
				message: "Driver deleted successfully",
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Error deleting driver",
				error: error.message || "Server error",
			});
		}
	}
}

export const adminDriversController = new AdminDriversController();
