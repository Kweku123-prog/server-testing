import { AccountApprovalStatus, STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Vendor } from "../../vendors";

class AdminOpsForVendorsService {
  async getVendors(page: number, approvalStatus?: string) {
    const query: { approvalStatus?: string } = {};

    if (approvalStatus) {
      query.approvalStatus = approvalStatus;
    }

    const options = {
      page,
      limit: 15,
      select:
        "firstName lastName email phoneNumber accountStatus approvalStatus createdAt",
      lean: true,
      leanWithId: false,
      sort: { createdAt: -1 },
    };

    const vendors = await Vendor.paginate(query, options);
    return vendors;
  }

  
  async rejectVendor(vendorId: string) {
    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      {
        $set: { approvalStatus: AccountApprovalStatus.REJECTED },
      },
      { new: true }
    ).select("approvalStatus");

    if (!vendor) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Vendor not found");
    }
  }

  async getVendorDetails(vendorId: string) {
    const vendor = await Vendor.findById(vendorId)
      .select("-__v -updatedAt -location -password")
      .lean();

    if (!vendor) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Vendor not found");
    }

    return vendor;
  }

  async approveVendor(vendorId: string) {
    const vendor = await Vendor.findById(vendorId).select("approvalStatus");
    if (!vendor) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Vendor not found");
    }
    vendor.approvalStatus = AccountApprovalStatus.APPROVED;
    await vendor.save();
  }
}

export const adminOpsForVendorsService = new AdminOpsForVendorsService();
