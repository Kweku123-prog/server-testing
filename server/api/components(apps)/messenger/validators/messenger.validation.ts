import Joi from "joi";
import { HandleException } from "../../../utils";
import { STATUS_CODES } from "../../../constants";

class ValidateMessenger {
  createOrder = async (payload: any) => {
    const createOrderSchema = Joi.object({
      customer: Joi.string().required().label("Customer"),
      packageType: Joi.string().required().label("Package type"),
      type: Joi.string().required().label("Type"),
      pickUpAddress: Joi.string().required().label("Pick-up address"),
      dropOffAddress: Joi.string().required().label("Drop-off address"),
      pickUpCoordinates: Joi.array().required().label("Pick-up coordinates"),
      dropOffCoordinates: Joi.array().required().label("Drop-off coordinates"),
      deliveryCost: Joi.number().label("Delivery cost"),
      scheduledPickUpTime: Joi.date().label("Scheduled pick-up time"),
      note: Joi.string().label("Note"),
    });

    const { error } = createOrderSchema.validate(payload, {
      allowUnknown: false,
      abortEarly: false,
    });

    if (error) {
      throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
    }

    return;
  };
}

export const validateMessenger = new ValidateMessenger();
