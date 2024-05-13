import crypto from "crypto";

import { DateTime } from "luxon";

class StringsUtils {
  public generateUniqueString(length: number) {
    const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
    const hexString = randomBytes.toString("hex").slice(0, length);
    const timestamp = DateTime.now().toUnixInteger().toString().substring(6);
    const uniqueString = `${hexString}${timestamp}`;
    return uniqueString;
  }

  toLowerCaseSetter(value: string): string {
    return value?.toLowerCase();
  }
}

export const stringsUtils = new StringsUtils();
