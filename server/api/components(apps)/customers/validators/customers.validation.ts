import Joi from "joi";
import { HandleException } from "../../../utils";
import { AccountStatus, STATUS_CODES } from "../../../constants";
import { ICustomer } from "../customers.interface";

class ValidateCustomers {
	signup = async (payload: any) => {
		const signUpSchema = Joi.object({
			firstName: Joi.string().required().label("First Name"),
			lastName: Joi.string().required().label("Last Name"),
			email: Joi.string().required().label("Email"),
			phoneNumber: Joi.string().required().label("Phone number"),
			password: Joi.string().required().label("Password"),
			profilePhoto: Joi.string().required().label("Photo"),
		});

		const { error } = signUpSchema.validate(payload, {
			abortEarly: false,
			allowUnknown: false,
		});

		if (error) {
			throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
		}

		return;
	};

	login = async (payload: any) => {
		const signUpSchema = Joi.object({
			phoneNumber: Joi.string().required().label("Phone number"),
			password: Joi.string().required().label("Password"),
		});

		const { error } = signUpSchema.validate(payload, {
			abortEarly: false,
			allowUnknown: false,
		});

		if (error) {
			throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
		}

		return;
	};

	updateProfile = async (payload: any) => {
		const signUpSchema = Joi.object({
			phoneNumber: Joi.string().label("Phone number"),
			firstName: Joi.string().label("First name"),
			lastName: Joi.string().label("Last name"),
			profilePhoto: Joi.string().label("Photo"),
			email: Joi.string().label("Email"),
			street: Joi.string().label("street"),
			city: Joi.string().label("City"),
			state: Joi.string().label("State"),
			country: Joi.string().label("Country"),
			dateOfBirth: Joi.string().label("Date of Birth"),
		});

		const { error } = signUpSchema.validate(payload, {
			abortEarly: false,
			allowUnknown: false,
		});

		if (error) {
			throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
		}

		return;
	};

	accountStatus = async (customer: { accountStatus: string }) => {
		const schema = Joi.object<ICustomer>({
			accountStatus: Joi.string()
				.valid(
					AccountStatus.ACTIVE,
					AccountStatus.INACTIVE,
					AccountStatus.SUSPENDED
				)
				.required()
				.label("account status"),
		});

		const { accountStatus } = customer;

		const { error } = schema.validate({ accountStatus } as ICustomer, {
			allowUnknown: false,
		});

		if (!error) return;

		throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
	};
}

export const validateCustomers = new ValidateCustomers();
