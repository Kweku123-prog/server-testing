import axios from "axios";
import { PAYSTACK_API_KEY } from "../../../config";
import { HandleException } from "../../../utils";
import { walletService } from "../../wallet";
import { transactionsRepo } from "../repository/transactions.repo";

class TransactionService {
  private paystackAPIKey: string;
  private headers: Record<string, string>;
  constructor() {
    this.paystackAPIKey = `${PAYSTACK_API_KEY}`;
    this.headers = {
      Authorization: `Bearer ${this.paystackAPIKey}`,
    };
  }
  async verifyPayment(payload: any) {
    const { reference } = payload;
    console.log(reference);

    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: this.headers,
        }
      );

      if (response.data.data.status === "success") {
        const responseData = response.data.data;
        var { amount, status } = responseData;
        console.log({amount, status})
        amount = amount / 100;
        const { receiverId: owner, customerId: paidBy, description } = responseData.metadata;
        const {channel, bank, card_type: cardType, mobile_money_number: mobileMoneyNumber} = responseData.authorization
        const senderEmail = responseData.customer.email

        walletService.recordEarningsAndCreditWallet({
          owner,
          paidBy,
          reference,
          description,
          amount,
        });

        await transactionsRepo.recordTransaction({
            paidBy, status, owner, amount, description,
            reference, channel, bank, cardType, mobileMoneyNumber, senderEmail
        })
        // console.log({ owner, customerId, description, amount, reference });
      } else {
        console.log(`Payment failed. Status: ${response.data}`);
      }
    } catch (error: any) {
        console.log({error})
      const errorResponse = error.response;
      throw new HandleException(errorResponse.status, errorResponse.data);
    }
  }
}

export const transactionService = new TransactionService();
