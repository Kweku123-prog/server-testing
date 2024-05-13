import { Earnings } from "../models/wallet.models";
import { IRecordEarnings } from "../wallet.interface";

class EarningsRepo {
  async recordEarnings(payload: IRecordEarnings, session?: any) {
    if (session) {
      await Earnings.create([payload], { session });
    } else {
      await Earnings.create(payload);
    }
  }

  async getEarnings(userId: string, page: number) {
    const query = { owner: userId };

    const options = {
      page,
      limit: 14,
      lean: true,
      select: "user amount date description reference",
      leanWithId: false,
      sort: { date: -1 },
    };

    const earnings = await Earnings.paginate(query, options);
    return earnings;
  }
}

export const earningsRepo = new EarningsRepo();
