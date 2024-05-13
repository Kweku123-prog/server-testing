import { Request, Response } from "express";
import { transportService } from "../services/transport.service";
import { STATUS_CODES } from "../../../constants";
import { handleErrorResponse, jwtUtils } from "../../../utils";
import { transportRepo } from "../repository/transport.repo";

class TransportController {
  async create(req: Request, res: Response) {
    try {
      const transportCompany = await transportRepo.createCompany(req.body);
      res.status(STATUS_CODES.OK).json({
        message: "Created towing company",
        data: { transportCompany },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const transportCompany = await transportService.login(req.body);
      console.log({ body: req.body });
      const payload = {
        _id: transportCompany._id,
        phoneNumber: transportCompany.phoneNumber,
      };
      const accessToken = jwtUtils.generateToken(payload, "1h");
      const refreshToken = jwtUtils.generateToken(payload, "14d");

      res.status(STATUS_CODES.OK).json({
        message: "Logged in",
        data: {
          _id: transportCompany._id,
          accessToken,
          refreshToken,
        },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      const _id = (req as any).user._id;
      const transportCompny = await transportService.getMe(_id);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched profile",
        data: {
          transportCompny,
        },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async updateProfile(req: Request, res: Response) {
    const id = (req as any).user._id;
    try {
      const transportCompany = await transportRepo.updateProfile(id, req.body);
      res.status(STATUS_CODES.OK).json({
        message: "Updated profile",
        data: { transportCompany },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getVehiclesByServiceType(req: Request, res: Response) {
    const { serviceTypeId } = req.params;
    try {
      const vehicleTypes = await transportService.getVehiclesByServiceType(
        `${serviceTypeId}`
      );
      res.status(STATUS_CODES.OK).json({
        message: "Found vehicle types",
        data: { vehicleTypes },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getServiceTypes(req: Request, res: Response) {
    try {
      const serviceTypes = await transportService.getServiceTypes();
      res.status(STATUS_CODES.OK).json({
        message: "Fetched service types",
        data: { serviceTypes },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async createTransportOrder(req: Request, res: Response) {
    try {
      const tripOrder = await transportRepo.createTransportOrder(req.body);
      res.status(STATUS_CODES.CREATED).json({
        message: "Created transport trip order",
        data: { tripOrder },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getTransportTripOrders(req: Request, res: Response) {
    const page = parseInt(req.params.page as string) || 1;
    const id = (req as any).user._id;
    try {
      const tripOrders = await transportService.getTransportTripOrders(
        id,
        page
      );
      res.status(STATUS_CODES.OK).json({
        message: "Fetched trip orders",
        data: { tripOrders },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getAirports(req: Request, res: Response) {
    try {
      const airports = await transportRepo.getAirports();
      res.status(STATUS_CODES.OK).json({
        message: "success",
        data: { airports },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  /* Deprecated
  async addVehicle(req: Request, res: Response) {
    const { vehicle } = req.body;
    const towingCompanyId = (req as any).user._id;
    try {
      await transportService.addVehicle({ vehicle }, towingCompanyId);
      res.status(STATUS_CODES.OK).json({
        message: "Added vehicle type",
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async addDriver(req: Request, res: Response) {
    const transportCompanyId = (req as any).user._id;
    try {
      const driver = await transportService.addDriver(
        req.body,
        transportCompanyId
      );
      res.status(STATUS_CODES.CREATED).json({
        message: "Added driver",
        data: { driver },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

    async getTransportCompanyDrivers(req: Request, res: Response) {
    const id = (req as any).user._id;
    try {
      const drivers = await transportService.getTransportCompanyDrivers(id);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched drivers",
        data: { drivers },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getTransportCompanyDriver(req: Request, res: Response) {
    try {
      const id = (req as any).user._id;
      const driver = await transportService.getTransportCompanyDriver(
        id,
        req.params.driverId
      );
      res.status(STATUS_CODES.OK).json({
        message: "Fetched driver",
        data: { driver },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async updateDriver(req: Request, res: Response) {
    const transportCompanyId = (req as any).user._id;
    try {
      const driver = await transportRepo.updateDriver(
        req.params.driverId,
        transportCompanyId,
        req.body
      );
      res.status(STATUS_CODES.OK).json({
        message: "Updated driver",
        data: { driver },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async deleteDriver(req: Request, res: Response) {
    const transportCompanyId = (req as any).user._id;
    try {
      await transportRepo.deleteDriver(req.params.driverId, transportCompanyId);
      res
        .status(STATUS_CODES.OK)
        .json({ message: "Driver deleted successfully" });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
  */
}

export const transportController = new TransportController();
