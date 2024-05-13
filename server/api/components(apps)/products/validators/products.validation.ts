import Joi from "joi";
import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";

class ValidateProducts {
  addProduct = async (payload: any) => {
    const addProductSchema = Joi.object({
      name: Joi.string().required().label("Product name"),
      description: Joi.string().required().label("Description"),
      price: Joi.number().required().label("Price"),
      photos: Joi.array().required().label("Product photos"),
      shop: Joi.string().required().label("Shop"),
      sizes: Joi.array().label("Sizes"),
      colors: Joi.array().label("colors"),
    });

    const { error } = addProductSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
    }

    return;
  };

  updateProduct = async (payload: any) => {
    const updateProductSchema = Joi.object({
      name: Joi.string().label("Product name"),
      description: Joi.string().label("Description"),
      price: Joi.number().label("Price"),
      photos: Joi.array().label("Product photos"),
      shop: Joi.string().label("Shop"),
      sizes: Joi.array().label("Sizes"),
      colors: Joi.array().label("colors"),
    });

    const { error } = updateProductSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
    }

    return;
  };
}

export const validateProducts = new ValidateProducts();
