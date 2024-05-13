import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { adminOpsForVendorsService } from "../services/admin.vendorsService";
import { handleErrorResponse } from "../../../utils";

class AdminOpsForVendorsController {
	async approveVendor(req: Request, res: Response) {
		try {
			await adminOpsForVendorsService.approveVendor(req.params.vendorId);
			res.status(STATUS_CODES.OK).json({
				message: "Success",
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Operation Failed",
				error: error.message || "Server error",
			});
		}
	}

	async rejectVendor(req: Request, res: Response) {
		try {
			await adminOpsForVendorsService.rejectVendor(req.params.vendorId);
			res.status(STATUS_CODES.OK).json({
				message: "Success",
			});
		} catch (error: any) {
			handleErrorResponse(res, error);
		}
	}

	async getVendors(req: Request, res: Response) {
		const page = parseInt(req.query.page as string) || 1;
		const approvalStatus = req.query.approval_status as string;

		try {
			const vendors = await adminOpsForVendorsService.getVendors(
				page,
				approvalStatus
			);
			res.status(STATUS_CODES.OK).json({
				messsge: "Found vendors",
				data: { vendors },
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Operation failed",
				error: error.message || "Server error",
			});
		}
	}

	async getVendorDetails(req: Request, res: Response) {
		try {
			const vendor = await adminOpsForVendorsService.getVendorDetails(
				req.params.vendorId
			);
			res.status(STATUS_CODES.OK).json({
				message: "Fetched driver",
				data: { vendor },
			});
		} catch (error: any) {
			res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				message: "Failed to get vendor",
				error: error.message || "Server error",
			});
		}
	}
}

export const adminOpsForVendorsController = new AdminOpsForVendorsController();
