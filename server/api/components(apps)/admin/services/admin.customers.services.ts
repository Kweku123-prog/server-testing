import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Customer, ICustomer } from "../../customers";
import { MakuTrip } from "../../maku";

class AdminCustomerService {
	async getAll(page: number) {
		const query = { deleted: { $in: [false, null] } };
		const options = {
			page,
			limit: 13,
			select: "firstName lastName email phoneNumber accountStatus createdAt",
			lean: true,
			leanWithId: false,
			sort: { createdAt: -1 },
		};

		return await Customer.paginate(query, options);
	}

	async get(id: string): Promise<ICustomer> {
		const customer = await Customer.findById(id)
			.select("-__v -password")
			.lean();

		if (!customer || customer.deleted)
			throw new HandleException(
				STATUS_CODES.NOT_FOUND,
				"Customer not found"
			);

		return customer;
	}

	async updateAccountStatus(
		id: string,
		customer: ICustomer
	): Promise<ICustomer> {
		const updatedCustomer = await Customer.findByIdAndUpdate(id, customer, {
			new: true,
		}).select("-__v -password");

		return updatedCustomer ?? ({} as ICustomer);
	}

	async delete(id: string): Promise<boolean> {
		const customer = { deleted: true } as ICustomer;

		const updatedCustomer = await Customer.findByIdAndUpdate(id, customer, {
			new: true,
		}).select("-__v -password");

		return updatedCustomer?.deleted ?? false;
	}

	async getCustomerMakuTrips(id: string, page: number) {
		const query = { customer: { $eq: id } };

		const options = {
			page,
			limit: 13,
			select: "-__v -pickUpCoordinates -destinationCoordinates -updatedAt",
			populate: [
				{
					path: "customer",
					select: "firstName lastName",
				},
				{
					path: "driver",
					select: "firstName lastName",
				},
			],
			lean: true,
			leanWithId: false,
			sort: { createdAt: -1 },
		};

		return await MakuTrip.paginate(query, options);
	}

	async getSingleMakuTrip(id: string) {
		const trip = await MakuTrip.findById(id)
			.select("-__v -password")
			.populate([
				{
					path: "customer",
					select: "firstName lastName phoneNumber",
				},
				{
					path: "driver",
					select: "firstName lastName phoneNumber",
				},
			]);

		if (trip == null)
			throw new HandleException(
				STATUS_CODES.NOT_FOUND,
				"Maku trip not found"
			);

		return trip;
	}
}
export const adminCustomerService = new AdminCustomerService();
