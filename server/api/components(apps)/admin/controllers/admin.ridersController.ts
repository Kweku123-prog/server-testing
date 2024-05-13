import { Request, Response } from "express";
import { adminRidersService } from "../services/admin.ridersService";
import { STATUS_CODES } from "../../../constants";

class AdminRidersController {
	async approveRider(req: Request, res: Response) {
		try {
			await adminRidersService.approveRider(req.params.riderId);
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

	async rejectRider(req: Request, res: Response) {
		try {
			await adminRidersService.rejectRider(req.params.riderId);
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

	async getRiders(req: Request, res: Response) {
		const page = parseInt(req.query.page as string) || 1;
		const approvalStatus = req.query.approval_status as string;

		try {
			const riders = await adminRidersService.getRiders(
				page,
				approvalStatus
			);
			res.status(STATUS_CODES.OK).json({
				message: "Fetched riders",
				data: { riders },
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Error getting riders",
				error: error.message || "Server error",
			});
		}
	}

	async getRiderDetails(req: Request, res: Response) {
		try {
			const rider = await adminRidersService.getRiderDetails(
				req.params.riderId
			);
			res.status(STATUS_CODES.OK).json({
				message: "Fetched rider",
				data: { rider },
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Error getting rider",
				error: error.message || "Server error",
			});
		}
	}

	async updateRider(req: Request, res: Response) {
		try {
			const rider = await adminRidersService.updateRider(
				req.params.riderId,
				req.body
			);
			res.status(STATUS_CODES.OK).json({
				message: "Updated rider",
				data: { rider },
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Error updating rider",
				error: error.message || "Server error",
			});
		}
	}

	async deleteRider(req: Request, res: Response) {
		try {
			await adminRidersService.deleteRider(req.params.riderId);
			res.status(STATUS_CODES.OK).json({
				message: "Rider deleted successfully",
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Error deleting rider",
				error: error.message || "Server error",
			});
		}
	}
}

export const adminRidersController = new AdminRidersController();
