import { PaginateModel, Schema, model, ClientSession } from "mongoose";
import Big from "big.js";
import paginate from "mongoose-paginate-v2";

import {
  IEarningsDocument,
  IWalletDocument,
  IWalletMethodsDocument,
} from "../wallet.interface";
import { HandleException, stringsUtils } from "../../../utils";
import {
  Currency,
  EarningsDescription,
  STATUS_CODES,
  WalletStatus,
  WithdrawalMethod,
} from "../../../constants";

const walletSchema = new Schema<IWalletDocument>(
  {
    _id: {
      type: String,
      default: () => stringsUtils.generateUniqueString(4),
    },
    owner: { type: String, required: true },
    ownerAccountType: { type: String, required: true },
    balance: { type: String, default: "0" },
    transactionCount: { type: Number, default: 0 },
    totalEarnings: { type: String, default: "0" },
    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.GHANA_CEDIS,
    },
    withdrawalDetails: [
      {
        channel: {
          type: String,
          enum: Object.values(WithdrawalMethod),
        },
        type: {type: String},
        bankName: String, // For bank names or mobile money service providers
        bankCode: String,
        accountName: String,
        accountNumber: String, // Account number for both bank and mobile money
        currency: String,
        recipientCode: String
      },
    ],
    status: {
      type: String,
      enum: Object.values(WalletStatus),
      default: WalletStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

walletSchema.statics.creditWallet = async function name(
  ownerId: string,
  amount: string,
  session?: ClientSession
) {
  const wallet = await this.findOne({ owner: ownerId })
    .select("balance totalEarnings")
    .session(session);

  if (!wallet) {
    throw new HandleException(STATUS_CODES.NOT_FOUND, "wallet not found");
  }

  wallet.balance = Big(wallet.balance).plus(amount);
  wallet.totalEarnings = Big(wallet.totalEarnings).plus(amount);

  await wallet.save({ session });

  return wallet;
};

walletSchema.statics.debitWallet = async function name(
  walletId: string,
  amount: string
) {
  const wallet = await this.findById(walletId).select("balance");

  if (!wallet) {
    throw new HandleException(STATUS_CODES.NOT_FOUND, "wallet not found");
  }

  wallet.balance = Big(wallet.balance).minus(amount);
  await wallet.save();

  return wallet;
};

const earningsSchema = new Schema<IEarningsDocument>(
  {
    _id: {
      type: String,
      default: () => stringsUtils.generateUniqueString(4),
    },
    owner: { type: String, required: true },
    paidBy: { type: String, required: true, ref: "Customer" },
    // wallet: { type: String, required: true, ref: "Wallet" },
    amount: { type: String, required: true },
    description: { type: String, enum: EarningsDescription },
    reference: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now() },
  },
  {
    timestamps: false,
  }
);

earningsSchema.plugin(paginate);

export const Wallet = model<IWalletDocument, IWalletMethodsDocument>(
  "Wallet",
  walletSchema
);
export const Earnings = model<
  IEarningsDocument,
  PaginateModel<IEarningsDocument>
>("Earnings", earningsSchema);
