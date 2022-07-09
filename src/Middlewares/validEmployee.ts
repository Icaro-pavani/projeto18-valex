import { NextFunction, Request, Response } from "express";
import * as employeeRepository from "../repositories/employeeRepository.js";

import { unprocessableError } from "./handleErrorsMiddleware.js";

export default async function validEmployee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id: number = parseInt(req.params.id);
  if (!id) {
    throw unprocessableError("The id must be a number!");
  }

  const employee = await employeeRepository.findById(id);
  if (!employee) {
    throw unprocessableError("There ins't an employee with this id!");
  }

  res.locals.employee = employee;

  next();
}
