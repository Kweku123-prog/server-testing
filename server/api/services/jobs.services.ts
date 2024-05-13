import { Agenda } from "agenda";
import { messengerService } from "../components(apps)/messenger";
import { DB_URL } from "../config/secrets.config";

const agenda = new Agenda({
  db: {
    address: `${DB_URL}`,
    collection: "aagendaJobs",
  },
  processEvery: "30 seconds",
});

agenda
  .on("ready", () => console.log("Agenda started!"))
  .on("error", () => console.log("Agenda connection error!"));

agenda.define("schedule-messenger-order", async (job: any) => {
  console.log("Running schedule");

  const { orderData, pickUpCoordinates, searchKMLimit } = job.attrs.data;
  messengerService.notifyNearestRiders(
    pickUpCoordinates,
    orderData,
    searchKMLimit
  );
  messengerService.remindCustomerOfScheduledOrder(
    orderData.customer.phoneNumber,
    orderData.scheduledPickUpTime
  );
});

export { agenda };
