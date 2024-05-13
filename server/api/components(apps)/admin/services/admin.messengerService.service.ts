import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { PackageType } from "../../messenger";

class AdminOpsForMessengerService {
  async createPackageType(payload: any) {
    const packageTypeExists = await PackageType.findOne({
      packageType: payload.packageType,
    })
      .select("packageType")
      .lean();

    if (packageTypeExists) {
      throw new HandleException(
        STATUS_CODES.CONFLICT,
        "Package type with this name already exists"
      );
    }

    const packageType = await PackageType.create({
      packageType: payload.packageType,
      photo: payload.photo,
    });

    return {
      id: packageType._id,
      packageType: packageType.packageType,
      photo: packageType.photo,
    };
  }
}

export const adminOpsForMessengerService = new AdminOpsForMessengerService();
