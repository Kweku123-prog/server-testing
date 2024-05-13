import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Earnings, Wallet } from "../models/wallet.models";
import { IRecordEarnings, IWithdrawalDetails } from "../wallet.interface";

class WalletRepository {
  async create(payload: { userId: string; accountType: string }) {
    const wallet = await Wallet.create({
      owner: payload.userId,
      ownerAccountType: payload.accountType,
    });

    return wallet;
  }

  async addWithdrawalDetails(
    ownerId: string,
    withdrawalDetails: IWithdrawalDetails
  ) {
    try {
      const wallet = await Wallet.findOneAndUpdate(
        { owner: ownerId },
        { $push: { withdrawalDetails: withdrawalDetails } },
        { new: true, select: "-__v -updatedAt -createdAt" }
      ).lean();


      return wallet;
    } catch (error: any) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, error.message);
    }
  }

  async getWithdrawalDetails(userId: string) {
    const withdrawalDetails = await Wallet.findOne({ owner: userId })
      .select("withdrawalDetails -_id")
      .lean()
      .exec();

    return withdrawalDetails;
  }
}

export const walletRepo = new WalletRepository();
