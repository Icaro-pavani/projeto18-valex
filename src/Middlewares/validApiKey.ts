import { NextFunction, Request, Response } from "express";
import { findByApiKey } from "../repositories/companyRepository.js";

import apiKeySchema from "../Schema/apiKeySchema.js";

export default async function validApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const apiKey = req.headers["x-api-key"] || "";

    if (!apiKey) {
      return res.sendStatus(401);
    }

    const apiKeyValidation: string = await apiKeySchema.validateAsync(apiKey);

    const company = await findByApiKey(apiKeyValidation);

    if (!company) {
      return res.sendStatus(401);
    }

    res.locals.company = company;
  } catch (error) {
    return res.status(401).send(error.message);
  }

  next();
}
