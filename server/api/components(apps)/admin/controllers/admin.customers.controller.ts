import { Request, Response } from "express";
import { AccountStatus, STATUS_CODES } from "../../../constants";
import { adminCustomerService } from "../services/admin.customers.services";
import { validateCustomers } from "../../customers/validators/customers.validation";

class AdminCustomerController {
	async getAll(req: Request, res: Response): Promise<Response> {
		const page = parseInt(req.query.page as string) || 1;
		try {
			const customers = await adminCustomerService.getAll(page);

			return res.status(STATUS_CODES.OK).json(customers);
		} catch (error: any) {
			return res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				error: true,
				message: error.message || "Server error",
			});
		}
	}

	async get(req: Request, res: Response): Promise<Response> {
		try {
			const customer = await adminCustomerService.get(req.params.id);
			return res.status(STATUS_CODES.OK).json(customer);
		} catch (error: any) {
			return res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				error: true,
				message: error.message || "Server error",
			});
		}
	}

	async updateAccountStatus(req: Request, res: Response): Promise<Response> {
		try {
			await validateCustomers.accountStatus(req.body);

			const updatedCustomer =
				await adminCustomerService.updateAccountStatus(
					req.params.id,
					req.body
				);

			return res.status(STATUS_CODES.OK).json(updatedCustomer);
		} catch (error: any) {
			console.error("Error updating customer:", error);

			return res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				error: true,
				message: error.message || "Server error",
			});
		}
	}

	async delete(req: Request, res: Response): Promise<Response> {
		try {
			const deleted = await adminCustomerService.delete(req.params.id);

			if (!deleted) {
				return res.status(STATUS_CODES.OK).json({
					error: true,
					message: "Unable to delete",
				});
			}

			return res.status(STATUS_CODES.OK).json({
				error: false,
				message: "Deleted successfully",
			});
		} catch (error: any) {
			console.error("Error updating customer:", error);

			return res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				error: true,
				message: error.message || "Server error",
			});
		}
	}

	async getCustomerMakuTrips(req: Request, res: Response): Promise<Response> {
		try {
			const customerId = req.params.id;
			const page = req.query.page;

			const trips = await adminCustomerService.getCustomerMakuTrips(
				customerId,
				Number(page)
			);

			return res.status(STATUS_CODES.OK).json(trips);
		} catch (error: any) {
			return res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				error: true,
				message: error.message ?? "Server error",
			});
		}
	}

	async getSingleMakuTrip(req: Request, res: Response): Promise<Response> {
		try {
			const tripId = req.params.id;

			const trip = await adminCustomerService.getSingleMakuTrip(tripId);

			return res.status(STATUS_CODES.OK).json(trip);
		} catch (error: any) {
			return res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
				error: true,
				message: error.message ?? "Server error",
			});
		}
	}
}

export const adminCustomerController = new AdminCustomerController();
