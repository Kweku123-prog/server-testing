import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Property } from "../models/property.model";

class PropertyRepository {
  async addProperty(payload: any, landlord: string) {
    const property = await Property.create({
      landlord: landlord,
      title: payload.title,
      description: payload.description,
      numberOfBedrooms: payload.numberOfBedrooms,
      numberOfBathrooms: payload.numberOfBathrooms,
      pets: payload.pets,
      furnished: payload.furnished,
      photos: payload.photos,
      rentPerMonth: payload.rentPerMonth,
      address: payload.address,
      location: {
        coordinates: payload.coordinates,
      },
    });

    return property;
  }

  async updateProperty(landlord: string, propertyId: string, payload: any) {
    if (payload.coordinates) {
      payload.location = {
        type: "Point",
        coordinates: payload.coordinates,
      };
    }

    const select = Object.keys(payload);
    select.push("-_id");

    const property = await Property.findOneAndUpdate(
      {
        _id: propertyId,
        landlord,
      },
      { $set: payload },
      { new: true }
    ).select(select);

    return property;
  }

  async delete(landlord: string, propertyId: string) {
    console.log({ landlord, propertyId });
    const result = Property.deleteOne({ landlord, _id: propertyId });

    if ((await result).deletedCount === 0) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "property not found");
    }
  }

  async getProperty(propertyId: string) {
    const property = await Property.findById(propertyId).select(
      "-__v -createdAt -updatedAt -location.type"
    );

    if (!property) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "property not found");
    }

    return property;
  }
}

export const propertyRepo = new PropertyRepository();
