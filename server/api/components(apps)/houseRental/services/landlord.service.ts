import { Property } from "../models/property.model";

class LandlordService {
  async getProperties(landlord: string, page: number) {
    const query = { landlord };

    const options = {
      page,
      limit: 14,
      select: {
        title: 1,
        photos: 1,
        numberOfBedrooms: 1,
        numberOfBathrooms: 1,
        rentPerMonth: 1,
      },
      lean: true,
      leanWithId: false,
    };
    const properties = await Property.paginate(query, options);

    return properties;
  }
}

export const landlordService = new LandlordService();
