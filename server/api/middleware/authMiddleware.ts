import { NextFunction, Request, Response } from "express";
import { HandleException, jwtUtils } from "../utils";
import { JwtPayload } from "jsonwebtoken";
import { Vendor } from "../components(apps)/vendors";
import { STATUS_CODES } from "../constants";

class AuthMiddleware {
  public isUserAuthorized(req: Request, res: Response, next: NextFunction) {
    const decodedUser = jwtUtils.verifyToken(req) as { _id: string, };
    if (decodedUser._id === req.params.vendorId) {
      next();
      return;
    }
    //   }
    return res
      .status(403)
      .json({ message: "You are not authorized to access this resource" });
  }

  public async checkProfileOwnership(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const decodedUser = jwtUtils.verifyToken(req) as JwtPayload;
      const user = await Vendor.findById(decodedUser._id);

      if (!user) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "User not found");
      }

      if (user._id.toString() === req.params.id) {
        next();
        return;
      }

      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "You are not authorized to perform this action"
      );
    } catch (error: any) {
      res.status(error.status | STATUS_CODES.SERVER_ERROR).json({
        message: "Operation failed",
        error: error.message,
      });
    }
  }
}

export const authMiddleware = new AuthMiddleware();
