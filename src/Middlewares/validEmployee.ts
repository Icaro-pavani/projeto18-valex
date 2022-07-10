import { NextFunction, Request, Response } from "express";
import { Company } from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import { employeeIdValidation } from "../Services/employeeServices.js";

import {
  unauthorizedError,
  unprocessableError,
} from "./handleErrorsMiddleware.js";

export default async function validEmployee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id: number = parseInt(req.params.id);
  const company: Company = res.locals.company;

  const employee = await employeeIdValidation(id, company.id);

  res.locals.employee = employee;

  next();
}
