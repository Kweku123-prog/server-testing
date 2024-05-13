import { PaginateModel, Schema, model } from "mongoose";
import { ICustomer } from "../customers.interface";
import { AccountStatus, Gender, URL_LINKS } from "../../../constants";
import { encryption, stringsUtils } from "../../../utils";
import paginate from "mongoose-paginate-v2";

const customerSchema = new Schema<ICustomer>(
	{
		_id: {
			type: String,
			required: true,
			default: () => stringsUtils.generateUniqueString(4),
		},
		firstName: {
			type: String,
			required: true,
			set: stringsUtils.toLowerCaseSetter,
		},
		lastName: {
			type: String,
			required: true,
			set: stringsUtils.toLowerCaseSetter,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			set: stringsUtils.toLowerCaseSetter,
		},
		phoneNumber: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		deleted: { type: Boolean, default: false },
		profilePhoto: {
			type: String,
			default: URL_LINKS.DEFAULT_ACCOUNT_PHOTO,
		},
		street: { type: String, default: "" },
		city: { type: String, default: "" },
		state: { type: String, default: "" },
		postalCode: { type: String, default: "" },
		country: {
			type: String,
			default: "",
			set: stringsUtils.toLowerCaseSetter,
		},
		latitude: Number,
		longitude: Number,
		dateOfBirth: Date,
		accountStatus: {
			type: String,
			enum: Object.values(AccountStatus),
			default: AccountStatus.ACTIVE,
		},
		lastLoggedIn: Date,
	},
	{ timestamps: true, _id: false }
);

customerSchema.plugin(paginate);

customerSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		try {
			this.password = await encryption.encryptValue(this.password);
		} catch (error: any) {
			return next(error);
		}
	}
	next();
});

export const Customer = model<ICustomer, PaginateModel<ICustomer>>(
	"Customer",
	customerSchema
);
