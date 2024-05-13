import { DriverRiderType, STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { DriverRider, IDriverRider } from "../../driversAndRiders";
import { IMakuVehicleType, MakuVehicleType } from "../../maku";
import { DeliveryRate, IDeliveryRate } from "../../orders";
import { Category, ShopType } from "../../shops";
import { IAddCategory, ICreateVehicleType } from "../admin.interfacee";

class AdminService {
	public async createShopType(payload: any) {
		const { categoryName, categoryImage } = payload;
		try {
			const shopTypeExists = await ShopType.findOne({
				name: payload.name,
			})
				.select("name")
				.lean();

			if (shopTypeExists) {
				throw new HandleException(
					STATUS_CODES.CONFLICT,
					`A shop type with this name '${payload.name}' exists already`
				);
			}

			const shopType = new ShopType({
				name: payload.name,
				description: payload.description,
				image: payload.image,
			});

			const savedShopType = await shopType.save();
			const shopTypeId = savedShopType._id;
			await this.addcategory({
				name: categoryName,
				image: categoryImage,
				shopTypeId,
			});

			return savedShopType;
		} catch (error: any) {
			throw new HandleException(error.status, error.message);
		}
	}

	public async addcategory(payload: IAddCategory) {
		try {
			const categoryExists = await Category.findOne({
				name: payload.name,
			})
				.select("name")
				.lean();

			if (categoryExists) {
				throw new HandleException(
					STATUS_CODES.CONFLICT,
					`A category with this name '${payload.name}' exists already`
				);
			}

			const newCategory = new Category({
				name: payload.name,
				image: payload.image,
				shopType: payload.shopTypeId,
			});

			const savedCategory = await newCategory.save();
			return savedCategory;
		} catch (error: any) {
			throw new HandleException(STATUS_CODES.SERVER_ERROR, error.message);
		}
	}

	public async updateShopType(id: string, payload: any) {
		try {
			const shopType = await ShopType.findByIdAndUpdate(
				id,
				{ $set: payload },
				{ new: true }
			).select(payload);
			if (!shopType) {
				throw new HandleException(
					STATUS_CODES.NOT_FOUND,
					"Shop type not found"
				);
			}

			return shopType;
		} catch (error: any) {
			throw new HandleException(error.status, error.message);
		}
	}

	public async updateCategory(id: string, payload: any) {
		try {
			const category = await Category.findByIdAndUpdate(
				id,
				{ $set: payload },
				{ new: true }
			);
			if (!category) {
				throw new HandleException(
					STATUS_CODES.NOT_FOUND,
					"Category does not exist"
				);
			}
		} catch (error: any) {
			throw new HandleException(error.status, error.message);
		}
	}

	public async deliveryRate(payload: IDeliveryRate) {
		try {
			const existingConfig = await DeliveryRate.findOne();
			if (existingConfig) {
				existingConfig.baseFee = payload.baseFee;
				existingConfig.feePerKM = payload.feePerKM;
				existingConfig.riderFeePerKM = payload.riderFeePerKM;
				await existingConfig.save();
				return existingConfig;
			} else {
				const newConfig = new DeliveryRate({
					baseFee: payload.baseFee,
					feePerKM: payload.feePerKM,
					riderFeePerKM: payload.riderFeePerKM,
				});
				await newConfig.save();
				return newConfig;
			}
		} catch (error: any) {
			console.error(
				"Error updating/creating delivery pricing:",
				error.message
			);
			throw new HandleException(error.status, error.message);
		}
	}

	public async createVehicleType(payload: ICreateVehicleType) {
		try {
			const vehicleType: IMakuVehicleType = new MakuVehicleType({
				vehicleType: payload.vehicleType,
				baseFee: payload.baseFee,
				feePerKM: payload.feePerKM,
				riderPercentage: payload.riderPercentage,
			});

			const savedVehicleType = await vehicleType.save();
			return savedVehicleType;
		} catch (error: any) {
			throw new HandleException(error.status, error.message);
		}
	}

	public async updateVehicleType(
		id: string,
		payload: Partial<IMakuVehicleType>
	) {
		try {
			const vehicleType = await MakuVehicleType.findByIdAndUpdate(
				id,
				{ $set: payload },
				{ new: true }
			)
				.select("-_id -__v")
				.lean();
			if (!vehicleType) {
				throw new HandleException(
					STATUS_CODES.NOT_FOUND,
					"vehicle type not found"
				);
			}
			return vehicleType;
		} catch (error: any) {
			throw new HandleException(error.status, error.message);
		}
	}
}

export const adminService = new AdminService();
