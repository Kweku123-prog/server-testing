import { Twilio } from "twilio";
import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} from "../config/secrets.config";
import { ISendSMS } from "./services.interface";

class SmsService {
  private twilioClient: Twilio;

  constructor() {
    this.twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }

  async sendSms(payload: ISendSMS) {
    try {
      const response = await this.twilioClient.messages.create({
        body: payload.message,
        from: `${TWILIO_PHONE_NUMBER}`,
        to: `+${payload.recipientPhoneNumber}`,
      });
      return response;
    } catch (error) {
      console.error(`Failed to send SMS: ${error}`);
    }
  }
}

export const smsService = new SmsService();
