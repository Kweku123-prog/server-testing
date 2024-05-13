import Joi from "joi";
import { HandleException } from "../../../utils";
import { STATUS_CODES } from "../../../constants";

class ValidateShops {
  createShop = async (payload: any) => {
    const createShopSchema = Joi.object({
      name: Joi.string().required().label("Shop name"),
      email: Joi.string().required().label("Email"),
      phoneNumber: Joi.string().required().label("Phone number"),
      street: Joi.string().required().label("street"),
      city: Joi.string().required().label("city"),
      country: Joi.string().required().label("country"),
      type: Joi.string().required().label("Shop type"),
      category: Joi.string().required().label("Category"),
      postalCode: Joi.string().label("Postal code"),
      logo: Joi.string().label("Logo"),
    });

    const { error } = createShopSchema.validate(payload, {
      allowUnknown: false,
      abortEarly: false,
    });

    if (error) {
      throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
    }
  };

  updateShop = async (payload: any) => {
    const updateShopSchema = Joi.object({
      name: Joi.string().label("Shop name"),
      email: Joi.string().label("Email"),
      phoneNumber: Joi.string().label("Phone number"),
      street: Joi.string().label("street"),
      city: Joi.string().label("city"),
      country: Joi.string().label("country"),
      type: Joi.string().label("Shop type"),
      category: Joi.string().label("Category"),
      postalCode: Joi.string().label("Postal code"),
      logo: Joi.string().label("Logo"),
    });

    const { error } = updateShopSchema.validate(payload, {
      allowUnknown: false,
      abortEarly: false,
    });

    if (error) {
      throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
    }
  };
}

export const validateShops = new ValidateShops();
