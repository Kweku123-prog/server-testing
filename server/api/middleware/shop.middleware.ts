import { NextFunction, Request, Response } from "express";
import { jwtUtils } from "../utils";
import { Shop } from "../components(apps)/shops";
import { STATUS_CODES } from "../constants";
import { JwtPayload } from "jsonwebtoken";

class ShopMiddleware {
  public async checkShopOwnerShip(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const decodedUser = jwtUtils.verifyToken(req) as JwtPayload
    //   const vendor = req.params.vendorId;
      const shop = await Shop.findById(req.params.shopId).select('_id vendor');

      // The vendor is the owner and can perform the action
      if (shop?.vendor.toString() === decodedUser._id) {
        next();
        return;
      }
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Operation failed",
        error: error.message,
      });
    }
  }
}

export const shopMiddleware = new ShopMiddleware();