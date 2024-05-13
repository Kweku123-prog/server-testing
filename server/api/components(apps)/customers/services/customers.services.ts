import bcrypt from "bcrypt";

import { Customer } from "../models/customers.models";
import { HandleException } from "../../../utils";
import { ICustomer, ISignupCustomer } from "../customers.interface";
import { ILoginCustomer } from "../customers.interface";
import { AccountStatus, MakuCabStatus, STATUS_CODES } from "../../../constants";
import { IOrder, Order } from "../../orders";
import { MakuTrip } from "../../maku";
import { TransportTripOrder, TowOrder } from "../../transport";
import { MessengerOrder } from "../../messenger";
import { redisClient } from "../../../services";

class CustomerService {
	async checkPhoneNumberIsTaken(phoneNumber: string) {
		const customer = await Customer.findOne({ phoneNumber })
			.select("phoneNumber")
			.lean();

		if (customer) {
			throw new HandleException(
				STATUS_CODES.CONFLICT,
				"Phone number exists for a registered customer"
			);
		}

		return;
	}

	async signup(payload: ISignupCustomer): Promise<any> {
		try {
			const newCustomer = new Customer({
				firstName: payload.firstName,
				lastName: payload.lastName,
				email: payload.email,
				phoneNumber: payload.phoneNumber,
				password: payload.password,
				profilePhoto: payload.photo,
			});
			const savedCustomer = await newCustomer.save();
			return savedCustomer;
		} catch (error: any) {
			throw new HandleException(error.status, error.message);
		}
	}

	async getCustomerByPhoneNumber(
		phoneNumber: string,
		selectFields?: string
	): Promise<ICustomer> {
		try {
			const query = Customer.findOne({
				phoneNumber: { $eq: phoneNumber },
				deleted: { $in: [false, null] },
			});

			if (selectFields) {
				query.select(selectFields);
			}

			const customer = await query.exec();

			console.log(customer);

			if (!customer) {
				throw new HandleException(404, "Customer not found");
			}

			return customer;
		} catch (error: any) {
			throw new HandleException(error.status, error.message);
		}
	}

	async login(payload: ILoginCustomer): Promise<any> {
		try {
			const customer = await this.getCustomerByPhoneNumber(
				payload.phoneNumber,
				"phoneNumber password accountStatus"
			);

			const passwordsMatch = await bcrypt.compare(
				payload.password,
				customer.password
			);

			if (!passwordsMatch) {
				throw new HandleException(
					STATUS_CODES.UNAUTHORIZED,
					"Incorrect password"
				);
			}

			if (customer.accountStatus == AccountStatus.INACTIVE) {
				throw new HandleException(
					STATUS_CODES.UNAUTHORIZED,
					"Your account is inactive, please contact an administrator"
				);
			}

			if (customer.accountStatus == AccountStatus.SUSPENDED) {
				throw new HandleException(
					STATUS_CODES.UNAUTHORIZED,
					"Your has been suspended"
				);
			}

			const loggedInCustomer = {
				_id: customer._id,
				phoneNumber: customer.phoneNumber,
			};

			return loggedInCustomer;
		} catch (error: any) {
			throw new HandleException(error.status, error.message);
		}
	}

	async getMe(id: string) {
		try {
			const customer = await Customer.findOne({
				_id: id,
				deleted: { $in: [false, null] },
			}).select("-__v -password -updatedAt -deleted");

			if (!customer) {
				throw new HandleException(
					STATUS_CODES.NOT_FOUND,
					"Customer account not found"
				);
			}

			if (customer.accountStatus == AccountStatus.INACTIVE) {
				throw new HandleException(
					STATUS_CODES.UNAUTHORIZED,
					"Your account is inactive, please contact an administrator"
				);
			}

			if (customer.accountStatus == AccountStatus.SUSPENDED) {
				throw new HandleException(
					STATUS_CODES.UNAUTHORIZED,
					"Your has been suspended"
				);
			}

			return customer;
		} catch (error: any) {
			throw new HandleException(error.status, error.message);
		}
	}

	async getOrders(
		customerId: string,
		page: number,
		status?: string
	): Promise<IOrder[]> {
		try {
			const filter: { customer: string; status?: string } = {
				customer: customerId,
			};
			if (status) {
				filter.status = status;
			}
			const options = {
				skip: (page - 1) * 10,
				limit: 10,
				select: "-__v -updatedAt -customer -deliveryAddressCord.type",
				populate: [
					{ path: "items.product", select: "name photos" },
					{ path: "items.shop", select: "name" },
				],
				sort: { createdAt: -1 },
				lean: true,
			};

			const orders = await Order.find(filter)
				.sort({ createdAt: -1 })
				.skip(options.skip)
				.limit(options.limit)
				.select(options.select)
				.populate(options.populate)
				.lean(options.lean)
				.exec();

			return orders;
		} catch (error: any) {
			throw new HandleException(error.status, error.message);
		}
	}

	async deleteAccount(customerId: string) {
		try {
			const result = await Customer.deleteOne({ _id: customerId });

			if (result.deletedCount === 0) {
				throw new HandleException(
					STATUS_CODES.NOT_FOUND,
					"Customer not found"
				);
			}
			console.log("Customer deleted successfully", customerId);
		} catch (error: any) {
			throw new HandleException(error.status, error.message);
		}
	}

	async makuTripHistory(customerId: string, page: number) {
		const cacheKey = `maku-trip-history:${customerId}:${page}`;
		const cachedData = await redisClient.get(cacheKey);
		if (cachedData) {
			return JSON.parse(cachedData);
		}

		const query = {
			customer: customerId,
			status: {
				$nin: [
					MakuCabStatus.PENDING,
					MakuCabStatus.STARTED,
					MakuCabStatus.ENROUTE_PICKUP_LOCATION,
					MakuCabStatus.ARRIVED_PICKUP_LOCATION,
				],
			},
		};
		const options = {
			page,
			limit: 15,
			select: "_id pickUpAddress destinationAddress price status createdAt",
			populate: [
				{
					path: "driver",
					select: "firstName lastName phoneNumber photo",
				},
			],
			lean: true,
			leanWithId: false,
			sort: { createdAt: -1 },
		};

		const trips = await MakuTrip.paginate(query, options);
		await redisClient.setWithExpiry(cacheKey, JSON.stringify(trips), 350);
		return trips;
	}

	async getMakuTripDetails(customerId: string, tripId: string) {
		const trip = await MakuTrip.findOne({
			_id: tripId,
			customer: customerId,
		})
			.select({
				updatedAt: 0,
				__v: 0,
				customer: 0,
				"destinationCoordinates.locationType": 0,
				"pickUpCoordinates.locationType": 0,
			})
			.populate({
				path: "driver",
				select: "firstName lastName photo phoneNumber vehicle",
			})
			.lean()
			.exec();
		return trip;
	}

	async getTransportTripOrders(customerId: string, page: number) {
		const query = {
			customer: customerId,
			serviceType: { $nin: ["c6a56821"] },
		};

		const options = {
			page,
			limit: 20,
			select: "destinationAddress createdAt status",
			populate: [{ path: "serviceType", select: "name" }],
			lean: true,
			leanWithId: false,
		};

		const transportTripOrders = await TransportTripOrder.paginate(
			query,
			options
		);
		return transportTripOrders;
	}

	async getTowingOrdersHistory(customerId: string, page: number) {
		const query = { customer: customerId };

		const options = {
			page,
			limit: 20,
			select: "createdAt status destinationAddress",
			// populate: [{ path: "towingCompany", select: "name" }],
			lean: true,
			leanWithId: false,
		};

		const towingOrders = await TowOrder.paginate(query, options);
		return towingOrders;
	}

	async messengerOrderHistory(customerId: string, page: number) {
		const query = { customer: customerId };
		const options = {
			page,
			limit: 20,
			select: "_id pickUpAddress dropOffAddress deliveryCost status createdAt",
			lean: true,
			leanWithId: false,
			sort: { createdAt: -1 },
		};

		const messengerOrders = await MessengerOrder.paginate(query, options);

		return messengerOrders;
	}
}

export const customerService = new CustomerService();
