import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { makuService } from "../services/maku.service";
import { handleErrorResponse } from "../../../utils";

class MakuController {
  public async getVehicleTypes(req: Request, res: Response) {
    try {
      const vehicleTypes = await makuService.getVehicleTypes();
      res.status(STATUS_CODES.OK).json({
        message: "Fetched cab types",
        data: {
          vehicleTypes,
        },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getTripDetails(req: Request, res: Response) {
    const { tripId } = req.params;
    try {
      const trip = await makuService.getTripDetails(tripId);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched trip details",
        data: { trip },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
}

export const makuController = new MakuController();
