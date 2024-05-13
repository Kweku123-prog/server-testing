import { Request, Response } from "express";
import { HandleException, handleErrorResponse, jwtUtils } from "../../../utils";
import { landlordRepo } from "../repository/landlord.repo";
import { STATUS_CODES } from "../../../constants";
import { landlordService } from "../services/landlord.service";

class LandlordController {
  async signup(req: Request, res: Response) {
    try {
      const landlord = await landlordRepo.signup(req.body);

      const jwtPayload = {
        _id: landlord._id,
        phoneNumber: landlord.phoneNumber,
      };
      const accessToken = jwtUtils.generateToken(jwtPayload, "1h");
      const refreshToken = jwtUtils.generateToken(jwtPayload, "30d");

      res.status(STATUS_CODES.CREATED).json({
        message: "success",
        data: { landlord, accessToken, refreshToken },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const landlord = await landlordRepo.login(req.body);
      const jwtPayload = {
        _id: landlord._id,
        phoneNumber: landlord.phoneNumber,
      };
      const accessToken = jwtUtils.generateToken(jwtPayload, "1h");
      const refreshToken = jwtUtils.generateToken(jwtPayload, "30d");

      res.status(STATUS_CODES.CREATED).json({
        message: "success",
        data: { landlord, accessToken, refreshToken },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async update(req: Request, res: Response) {
    const landlordId = (req as any).user._id;

    try {
      const landlord = await landlordRepo.update(landlordId, req.body);
      res.status(STATUS_CODES.OK).json({
        message: "success",
        data: { landlord },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async deleteAccount(req: Request, res: Response) {
    const landlordId = (req as any).user._id;
    try {
      await landlordRepo.deleteAccount(landlordId);
      res.status(STATUS_CODES.OK).json({
        message: "success",
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getProperties(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const landlordId = (req as any).user._id;

    try {
      const properties = await landlordService.getProperties(landlordId, page);
      res.status(STATUS_CODES.OK).json({
        message: "success",
        data: { properties },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
}

export const landlordController = new LandlordController();
