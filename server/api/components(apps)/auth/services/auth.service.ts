import jwt, { decode } from "jsonwebtoken";
import { STATUS_CODES } from "../../../constants";
import { HandleException, jwtUtils } from "../../../utils";
import { JWT_SECRET_KEY } from "../../../config";

class AuthService {
  public async refreshAccessToken(refreshToken: string) {
    console.log({ refreshToken });
    try {
      if (!refreshToken) {
        throw new HandleException(STATUS_CODES.FORBIDDEN, "Unauthorized");
      }
      const decoded: any =  jwt.verify(refreshToken, `${JWT_SECRET_KEY}`);
      console.log({ decoded });
      const accessToken = jwtUtils.generateToken(
        { phoneNumber: decoded.phoneNumber, _id: decoded._id },
        "1h"
      );
      return accessToken;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }
}

export const authService = new AuthService();
