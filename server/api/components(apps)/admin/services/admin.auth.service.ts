import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Admin, AdminModel } from "../models/admin.model";
import bcrypt from "bcrypt";

class AdminAuthService {
	async signup(admin: Admin): Promise<Admin> {
		try {
			const model = new AdminModel(admin);

			const isTaken = await AdminAuthService.isEmailTaken(admin.email);

			if (isTaken) {
				throw new HandleException(
					STATUS_CODES.CONFLICT,
					"Email is already taken"
				);
			}

			return model.save();
		} catch (error: any) {
			console.error("Admin signup error:", error);

			throw new HandleException(error.status, error.message);
		}
	}

	async signin({ email, password }: Admin): Promise<Admin> {
		try {
			const foundAdmin: Admin = await AdminModel.findOne({
				email,
			}).select("_id password isActive");

			if (!foundAdmin) {
				throw new HandleException(
					STATUS_CODES.UNAUTHORIZED,
					"Incorrect email address or password"
				);
			}

			const authenticated = await bcrypt.compare(
				password,
				foundAdmin.password
			);

			if (!authenticated) {
				throw new HandleException(
					STATUS_CODES.UNAUTHORIZED,
					"Incorrect email address or password"
				);
			}

			if (!foundAdmin.isActive) {
				throw new HandleException(
					STATUS_CODES.UNAUTHORIZED,
					"Your account is not active. Please contact an administrator"
				);
			}

			return { _id: foundAdmin._id, email } as Admin;
		} catch (error: any) {
			throw new HandleException(error.status, error.message);
		}
	}

	private static async isEmailTaken(email: string): Promise<boolean> {
		const admin = await AdminModel.findOne({ email });

		return admin != null;
	}
}

export const adminAuthService = new AdminAuthService();
