import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import {
  TransportVehicleType,
  TransportServiceType,
  TransportCompany,
  Airport,
} from "../../transport";
// import { Airport } from "../../transport/models/airport.model";

class AdminTransportService {
  async createVehicleType(payload: any) {
    console.log(payload);
    const transportVehicleType = await new TransportVehicleType({
      vehicleType: payload.vehicleType,
      serviceType: payload.serviceType,
      photo: payload.photo,
      feePerKM: payload.feePerKM,
      transportCompanyPercentage: payload.transportCompanyPercentage,
    }).save();

    return {
      _id: transportVehicleType._id,
      vehicleType: transportVehicleType.vehicleType,
    };
  }

  async createServiceType(payload: any) {
    const serviceType = await new TransportServiceType({
      name: payload.name,
    }).save();

    return serviceType._id;
  }

  async getServiceTypes() {
    const serviceTypes = await TransportServiceType.find()
      .select("name")
      .lean()
      .exec();

    return serviceTypes;
  }

  async getVehiclesByServiceType(serviceType: string) {
    const vehicleTypes = TransportVehicleType.find({ serviceType })
      .select("vehicleType feePerKM transportCompanyPercentage photo")
      .lean()
      .exec();

    return vehicleTypes;
  }

  async getTransportCompanies(page: number) {
    const query = {};
    const options = {
      page,
      limit: 20,
      select: "name email address vehicleRegNumber",
      populate: [{ path: "serviceType", select: { name: 1, _id: 0 } }],
      lean: true,
      leanWithId: false,
    };

    const transportCompanies = await TransportCompany.paginate(query, options);
    return transportCompanies;
  }

  async getCompanyDetails(companyId: string) {
    const transportCompany = await TransportCompany.findById(companyId)
      // .select("-__v -location")
      .select("name phoneNumber address vehicleRegNumber vehiclePhotos email")
      .populate({ path: "vehicleType", select: "vehicleType" })
      .populate({ path: "serviceType", select: "name" })
      .lean()
      .exec();

    if (!transportCompany) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Company not found");
    }

    return transportCompany;
  }

  async addAirport(payload: any) {
    const airportExists = await Airport.findOne({ name: payload.name })
      .select("name")
      .lean();
    if (airportExists) {
      throw new HandleException(
        STATUS_CODES.CONFLICT,
        "Airport already exists"
      );
    }
    const airport = await Airport.create({
      name: payload.name,
      address: payload.address,
      location: {
        coordinates: payload.location,
      },
    });

    return {
      _id: airport._id,
      name: airport.name,
      address: airport.address,
    };
  }

  async getAllAirports() {
    const airports = await Airport.find()
      .select("name location.coordinates")
      .lean();

    return airports;
  }
}

export const adminTransportService = new AdminTransportService();
