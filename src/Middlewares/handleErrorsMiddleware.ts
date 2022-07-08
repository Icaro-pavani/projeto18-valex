import { NextFunction, Request, Response } from "express";

const serviceErrorToStatusCode = {
  Unauthorized: 401,
  conflict: 409,
  unprocessable: 422,
};

export function conflictError() {
  return { type: "conflict" };
}

export function unprocessableError() {
  return { type: "unprocessable" };
}

export function unauthorizedError() {
  return { type: "unauthoprized" };
}

export default async function handleErrors(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error) {
    return res.sendStatus(serviceErrorToStatusCode[error.type]);
  }

  return res.sendStatus(500);
}
