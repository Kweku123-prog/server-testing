import { ClientSession, Document, Model } from "mongoose";
import {
  Currency,
  WithdrawalMethod,
  WIthdrawalFrequency,
  WalletStatus,
  WithdrawalRequestStatus,
} from "../../constants";

export interface IWalletDocument extends Document {
  _id: string;
  owner: string;
  ownerAccountType: string;
  balance: string;
  transactionCount: number;
  totalEarnings: string;
  currency: Currency;
  withdrawalDetails: [IWithdrawalDetails];
  withdrawalFrequency: WIthdrawalFrequency;
  status: WalletStatus;
}

export interface IWalletMethodsDocument extends Model<IWalletDocument> {
  creditWallet(
    ownerId: string,
    amount: string,
    session?: ClientSession
  ): Promise<IWalletDocument>;
  debitWallet(
    ownerId: string,
    amount: string,
    session?: ClientSession
  ): Promise<IWalletDocument>;
}

export interface IEarningsDocument extends Document {
  _id: string;
  owner: string;
  paidBy: string;
  wallet: IWalletDocument;
  amount: string;
  description: string;
  reference: string;
  date: Date;
}

export interface WithdrawalRequestDocument extends Document {
  _id: string;
  user: string;
  wallet: string;
  status: WithdrawalRequestStatus;
  amount: number;
  date: Date;
}

export interface IRecordEarnings {
  owner: string;
  paidBy: string;
  amount: string;
  description: string;
  reference: string;
}

export interface IWithdrawalDetails {
  channel: string;
  type: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  currency: string;
  recipientCode: string;
}
