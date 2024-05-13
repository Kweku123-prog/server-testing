import { Request, Response } from "express";
import { customerService } from "../services/customers.services";
import { userService } from "../../../services";
import { handleErrorResponse, jwtUtils } from "../../../utils";
import { STATUS_CODES } from "../../../constants";
import { customerRepo } from "../repository/customers.repo";
import { validateCustomers } from "../validators/customers.validation";

class CustomerController {
	async signup(req: Request, res: Response): Promise<void> {
		try {
			await validateCustomers.signup(req.body);

			await Promise.all([
				userService.isEmailTaken(req.body.email),
				customerService.checkPhoneNumberIsTaken(req.body.phoneNumber),
			]);

			const customer = await customerService.signup(req.body);

			const payload = {
				phoneNumber: customer.phoneNumber,
				_id: customer._id,
			};
			const accessToken = jwtUtils.generateToken(payload, "1h");
			const refreshToken = jwtUtils.generateToken(payload, "14d");

			res.status(201).json({
				message: "Customer created successfully",
				data: {
					customerId: customer._id,
					accessToken,
					refreshToken,
				},
			});
		} catch (error: any) {
			handleErrorResponse(res, error);
		}
	}

	async login(req: Request, res: Response) {
		const phoneNumber = req.body.phoneNumber;
		const password = req.body.password;

		try {
			await validateCustomers.login(req.body);
			const customer = await customerService.login({
				phoneNumber,
				password,
			});

			const payload = {
				phoneNumber: customer.phoneNumber,
				_id: customer._id,
			};

			const accessToken = jwtUtils.generateToken(payload, "1h");
			const refreshToken = jwtUtils.generateToken(payload, "14d");
			res.status(200).json({
				message: "Successfully logged in",
				data: {
					_id: customer._id,
					accessToken,
					refreshToken,
				},
			});
		} catch (error: any) {
			handleErrorResponse(res, error);
		}
	}

	async getMe(req: Request, res: Response) {
		try {
			const customerId = (req as any).user._id;
			const customer = await customerService.getMe(customerId);
			res.status(STATUS_CODES.OK).json({
				message: "Fetched custommer profile",
				data: { customer },
			});
		} catch (error: any) {
			handleErrorResponse(res, error);
		}
	}

	async updateProfile(req: Request, res: Response) {
		const customerId = (req as any).user._id;
		try {
			await validateCustomers.updateProfile(req.body);

			const customer = await customerRepo.updateProfile(
				customerId,
				req.body
			);

			res.status(STATUS_CODES.OK).json({
				message: "Updated profile",
				data: { customer },
			});
		} catch (error: any) {
			handleErrorResponse(res, error);
		}
	}

	async getOrders(req: Request, res: Response) {
		const status = req.query.status as string;
		const page = parseInt(req.query.page as string) || 1;
		try {
			const customerId = (req as any).user._id;
			const orders = await customerService.getOrders(
				customerId,
				page,
				status
			);

			res.status(STATUS_CODES.OK).json({
				message: "Fetched orders",
				data: { orders },
			});
		} catch (error: any) {
			handleErrorResponse(res, error);
		}
	}

	async deleteAccount(req: Request, res: Response) {
		const userId = (req as any).user._id;
		try {
			await customerService.deleteAccount(userId);
			res.status(STATUS_CODES.OK).json({
				message: "Customer deleted successfully",
			});
		} catch (error: any) {
			handleErrorResponse(res, error);
		}
	}

	async makuTripHistory(req: Request, res: Response) {
		const page = parseInt(req.query.page as string) || 1;
		try {
			const customerId = (req as any).user._id;
			const trips = await customerService.makuTripHistory(
				customerId,
				page
			);
			res.status(STATUS_CODES.OK).json({
				message: "Fetched trips",
				data: { trips },
			});
		} catch (error: any) {
			handleErrorResponse(res, error);
		}
	}

	async getmakuTripDetails(req: Request, res: Response) {
		const customerId = (req as any).user._id;
		try {
			const trip = await customerService.getMakuTripDetails(
				customerId,
				req.params.tripId
			);
			res.status(STATUS_CODES.OK).json({
				message: "Fetched trip details",
				data: { trip },
			});
		} catch (error: any) {
			handleErrorResponse(res, error);
		}
	}

	async getTransportTripOrders(req: Request, res: Response) {
		const page = parseInt(req.params.page as string) || 1;
		const customerId = (req as any).user._id;
		try {
			const tripOrders = await customerService.getTransportTripOrders(
				customerId,
				page
			);
			res.status(STATUS_CODES.OK).json({
				message: "Fetched trip orders",
				data: { tripOrders },
			});
		} catch (error: any) {
			handleErrorResponse(res, error);
		}
	}

	async getTowingOrdersHistory(req: Request, res: Response) {
		const page = parseInt(req.query.page as string) || 1;
		try {
			const customerId = (req as any).user._id;
			const towingHistory = await customerService.getTowingOrdersHistory(
				customerId,
				page
			);
			res.status(STATUS_CODES.OK).json({
				message: "Fetched towing history",
				data: { towingHistory },
			});
		} catch (error: any) {
			handleErrorResponse(res, error);
		}
	}

	async messengerOrderHistory(req: Request, res: Response) {
		const page = parseInt(req.query.page as string) || 1;
		try {
			const customerId = (req as any).user._id;
			const messengerOrders = await customerService.messengerOrderHistory(
				customerId,
				page
			);
			res.status(STATUS_CODES.OK).json({
				message: "Success",
				data: { messengerOrders },
			});
		} catch (error: any) {
			handleErrorResponse(res, error);
		}
	}
}

export const customerController = new CustomerController();
