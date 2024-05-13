import { Transaction } from "../models/transactions.models";

class TransactionsRepository {
  async recordTransaction(payload: any) {
    const transaction = await Transaction.create({
      sender: payload.paidBy,
      senderEmail: payload.senderEmail,
      receiver: payload.owner,
      amount: payload.amount,
      status: payload.status,
      channel: payload.channel,
      bank: payload.bank,
      cardType: payload.cardType,
      mobileMoneyNumber: payload.mobileMoneyNumber,
      reference: payload.reference,
      description: payload.description,
    });

    return transaction;
  }

  async getTransactionForUser(userId: string, page: number) {
    const query = { user: userId };

    const options = {
      page,
      limit: 15,
      select: "type amount reference description createdAt status",
      lean: true,
      leanWithId: false,
      sort: { date: -1 },
    };

    const transactions = await Transaction.paginate(query, options);
    return transactions;
  }
}

export const transactionsRepo = new TransactionsRepository();
