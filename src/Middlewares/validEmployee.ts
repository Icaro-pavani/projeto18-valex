import { NextFunction, Request, Response } from "express";
import { findById } from "../repositories/employeeRepository.js";

import { unprocessableError } from "./handleErrorsMiddleware.js";

export default async function validEmployee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id: number = parseInt(req.params.id);
  if (!id) {
    throw unprocessableError();
  }

  const employee = await findById(id);
  if (!employee) {
    throw unprocessableError();
  }

  res.locals.employee = employee;

  next();
}
