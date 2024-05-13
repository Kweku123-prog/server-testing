import { TransactionDescription, TransactionType } from "../../constants";
import { IWalletDocument } from "../wallet";

export interface ITransactionDocument extends Document {
  _id: string;
  sender: IWalletDocument;
  senderEmail: string;
  receiver: string;
  channel: string;
  bank: string;
  cardType: string;
  mobileMoneyNumber: string;
  date: Date;
  type: TransactionType;
  status: string;
  amount: string;
  description: TransactionDescription;
  reference: string;
}
