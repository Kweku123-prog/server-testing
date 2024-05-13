import Joi from "joi";
import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";

class ValidateOrders {
  createOrder = async (payload: any) => {
    const createOrderSchema = Joi.object({
      customer: Joi.string().required().label("Customer"),
      items: Joi.array().required().label("Items"),
      deliveryFee: Joi.number().required().label("Delivery fee"),
      deliveryAddress: Joi.string().required().label("Delivery address"),
      deliveryAddressCoordinates: Joi.array()
        .required()
        .label("Delivery address coordinates"),
      productTotal: Joi.number().required().label("Product total cost"),
      totalAmmount: Joi.number().required().label("Total cost"),
    });

    const { error } = createOrderSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
    }

    return;
  };
}
export const validateOrders = new ValidateOrders();
