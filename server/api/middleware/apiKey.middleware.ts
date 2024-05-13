import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants";
import { ADMIN_API_KEY } from "../config/secrets.config";

const validApiKey = ADMIN_API_KEY;

const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const providedApiKey = req.headers["apikey"];
  console.log("Provided API Key:", providedApiKey);

  if (!providedApiKey || providedApiKey === undefined) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ error: "Unauthorized - Invalid API key" });
  }

  if (providedApiKey !== validApiKey) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: "Unauthorized - Invalid API key" });
  }

  next();
};

export { apiKeyMiddleware };
