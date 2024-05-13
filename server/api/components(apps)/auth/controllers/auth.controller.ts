import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { STATUS_CODES } from "../../../constants";

class AuthController {
  public async refreshAccessToken(req: Request, res: Response) {
    try {
      const accessToken = await authService.refreshAccessToken(req.body.refreshToken);
      res.status(STATUS_CODES.OK).json({
        message: "Access token generated",
        data: {accessToken},
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error generating access token",
        error: error.message,
      });
    }
  }
}

export const authController = new AuthController();
