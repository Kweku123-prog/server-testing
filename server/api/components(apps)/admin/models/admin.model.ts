import mongoose, { Schema, InferSchemaType } from "mongoose";
import { HandleException, encryption, stringsUtils } from "../../../utils";
import { AdminRole, STATUS_CODES } from "../../../constants";
import Joi from "joi";

const schema = new Schema(
	{
		_id: {
			type: String,
			required: true,
			default: () => stringsUtils.generateUniqueString(10),
		},
		firstName: { type: String, required: true, trim: true },
		lastName: { type: String, required: true, trim: true },
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			set: stringsUtils.toLowerCaseSetter,
			// validator: async (email) => {

			// }
		},
		isActive: { type: Boolean, default: false },
		role: {
			type: String,
			enum: Object.values(AdminRole),
			default: AdminRole.ADMIN,
		},
		password: { type: String, required: true },
	},
	{ timestamps: true, _id: false }
);

schema.pre("save", async function (next) {
	if (this.isModified("password")) {
		try {
			this.password = await encryption.encryptValue(this.password);
		} catch (error: any) {
			return next(error);
		}
	}
	next();
});

export type Admin = InferSchemaType<typeof schema>;

export const AdminModel = mongoose.model<Admin>("Admin", schema);

export const validateSigninCredentials = async ({ email, password }: Admin) => {
	const schema = Joi.object<Admin>({
		email: Joi.string().email().required().label("You email address"),
		password: Joi.string().required().label("Password"),
	});

	const { error } = schema.validate({ email, password } as Admin, {
		allowUnknown: false,
	});

	if (!error) return;

	throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
};

export const validateSignupCredentials = async (admin: Admin) => {
	const schema = Joi.object<Admin>({
		firstName: Joi.string().required().label("Your first name"),
		lastName: Joi.string().required().label("Your last name"),
		email: Joi.string().email().required().label("Your email address"),
		password: Joi.string().required().label("Your password"),
	});

	const { firstName, lastName, email, password } = admin;

	const { error } = schema.validate(
		{
			firstName,
			lastName,
			email,
			password,
		} as Admin,
		{
			allowUnknown: false,
		}
	);

	if (!error) return;

	throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
};
