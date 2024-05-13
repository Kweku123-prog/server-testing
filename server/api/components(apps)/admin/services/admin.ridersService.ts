import { AccountApprovalStatus, STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { DriverRider, IDriverRider } from "../../driversAndRiders";

class AdminRidersService {
  async approveRider(riderId: string) {
    const rider = await DriverRider.findOne({
      _id: riderId,
      accountType: "rider",
    }).select("approved");

    if (!rider) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Rider not found");
    }

    rider.approvalStatus = AccountApprovalStatus.APPROVED;
    await rider.save();
  }

  async rejectRider(riderId: string) {
    const rider = await DriverRider.findOne({
      _id: riderId,
      accountType: "rider",
    }).select("approved");

    if (!rider) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Rider not found");
    }

    rider.approvalStatus = AccountApprovalStatus.REJECTED;
    await rider.save();
  }
  
  async getRiders(page: number, approvalStatus?: string) {
    const query: { accountType: "rider"; approvalStatus?: string } = {
      accountType: "rider",
    };

    if (approvalStatus) {
      query.approvalStatus = approvalStatus;
    }
    const options = {
      page,
      limit: 15,
      select: "firstName lastName email phoneNumber accountStatus createdAt",
      lean: true,
      leanWithId: false,
      sort: { createdAt: -1 },
    };

    const riders = await DriverRider.paginate(query, options);
    return riders;
  }

  async getRiderDetails(riderId: string) {
    const rider = await DriverRider.findOne({
      _id: riderId,
      accountType: "rider",
    })
      .select("-middleName -__v -updatedAt -location -accountType -password")
      .lean();

    if (!rider) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Rider not found");
    }
    return rider;
  }

  async updateRider(riderId: string, payload: Partial<IDriverRider>) {
    const select = Object.keys(payload);
    select.push("-_id");

    const rider = await DriverRider.findByIdAndUpdate(
      riderId,
      { $set: payload },
      { new: true }
    )
      .select(select)
      .lean();

    if (!rider) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Rider not found");
    }

    return rider;
  }

  async deleteRider(riderId: string) {
    const result = await DriverRider.deleteOne({
      _id: riderId,
      accountType: "rider",
    });

    if (result.deletedCount === 0) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Rider not found");
    }
  }
}

export const adminRidersService = new AdminRidersService();
