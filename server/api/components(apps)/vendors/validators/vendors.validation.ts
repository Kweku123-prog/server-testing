import Joi from "joi";

import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";

class ValidateVendors {
  signup = async (payload: any) => {
    const signUpSchema = Joi.object({
      firstName: Joi.string().required().label("First Name"),
      lastName: Joi.string().required().label("Last Name"),
      middleName: Joi.string().required().label("MJiddle Name"),
      email: Joi.string().required().label("Email"),
      phoneNumber: Joi.string().required().label("Phone number"),
      password: Joi.string().required().label("Password"),
      photo: Joi.string().required().label("Photo"),
      govtIdPhoto: Joi.string().required().label("Government ID photo"),
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
    const signUpSchema = Joi.object({
      phoneNumber: Joi.string().required().label("Phone number"),
      password: Joi.string().required().label("Password"),
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

  
  updateProfile = async (payload: any) => {
    const loginSchema = Joi.object({
      phoneNumber: Joi.string().label("Phone number"),
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

export const validateVendors = new ValidateVendors();
