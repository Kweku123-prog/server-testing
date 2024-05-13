import { EventEmitter } from "events";
import { walletRepo } from "../components(apps)/wallet";

const eventEmitter = new EventEmitter();

export const emitEvent = (eventName: string, message: any) => {
  console.log({ eventMessage: message });

  eventEmitter.emit(eventName, message);
};

eventEmitter.on("create-wallet", (data) => {
  const { userId, accountType } = data;
  console.log({ eventData: data });

  try {
    const wallet = walletRepo.create({ userId, accountType });
    console.log("Created wallet", wallet, "for user", userId);
  } catch (error: any) {
    console.log({ error });
  }
});
