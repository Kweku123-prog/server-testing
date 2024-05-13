import bcrypt from "bcrypt";
import { STATUS_CODES } from "../constants";
import { HandleException } from "./handleException";

class Encryption {
  public async encryptValue(value: string) {
    try {
      const saltRounds = 10;
      const hashedValue = await bcrypt.hash(value, saltRounds);
      return hashedValue;
    } catch (error: any) {
      throw new HandleException(STATUS_CODES.SERVER_ERROR, error);
    }
  }

  public async compareValues(plainValue: string, hashValue: string) {
    return bcrypt.compare(plainValue, hashValue);
  }
}

export const encryption = new Encryption();
