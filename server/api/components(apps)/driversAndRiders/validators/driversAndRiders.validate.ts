import Joi from "joi";
import { HandleException } from "../../../utils";
import { STATUS_CODES } from "../../../constants";

class ValidateDriversAndRiders {
  signup = async (payload: any) => {
    const signUpSchema = Joi.object({
      firstName: Joi.string().required().label("First name"),
      middleName: Joi.string().label("Middle name"),
      lastName: Joi.string().required().label("Last name"),
      email: Joi.string().required().label("Email"),
      phoneNumber: Joi.string().required().label("Phone number"),
      password: Joi.string().required().label("Password"),
      photo: Joi.string().required().label("Photo"),
      vehicleType: Joi.string().required().label("Vehicle type"),
      vehicle: Joi.string().required().label("Vehicle"),
      vehicleInsurancePhoto: Joi.string()
        .required()
        .label("vehicle insurance photo"),
      licenseNumber: Joi.string().required().label("License number"),
      govtIdPhoto: Joi.string().required().label("Government ID photo"),
      street: Joi.string().required().label("Street"),
      city: Joi.string().required().label("City"),
      state: Joi.string().required().label("State"),
      country: Joi.string().required().label("Country"),
    });

    const { error } = signUpSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
    }

    return;
  };

  login = async (payload: any) => {
    const loginSchema = Joi.object({
      phoneNumber: Joi.string().required().label("Phone number"),
      password: Joi.string().required().label("Password"),
    });

    const { error } = loginSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
    }

    return;
  };

  updateProfile = async (payload: any) => {
    const loginSchema = Joi.object({
      phoneNumber: Joi.string().label("Phone number"),
      vehicleType: Joi.string().label("Vehicle type"),
      vehicle: Joi.string().label("Vehicle"),
      vehicleInsurancePhoto: Joi.string()
        .required()
        .label("vehicle insurance photo"),

      govtIdphoto: Joi.string().label("Government ID photo"),
      street: Joi.string().label("Street"),
      city: Joi.string().label("City"),
      state: Joi.string().label("State"),
      country: Joi.string().label("Country"),
    });

    const { error } = loginSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
    }

    return;
  };
}

export const validateDriversAndRiders = new ValidateDriversAndRiders();
