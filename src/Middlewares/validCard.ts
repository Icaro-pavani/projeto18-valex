import { NextFunction, Request, Response } from "express";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

import * as cardRepository from "../repositories/cardRepository.js";
import {
  unauthorizedError,
  unprocessableError,
} from "./handleErrorsMiddleware.js";

export default async function validCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id: number = parseInt(req.params.id);
  if (!id) {
    throw unprocessableError("The id must be a number!");
  }

  const card = await cardRepository.findById(id);
  if (!card) {
    throw unprocessableError("There isn't a card with this id!");
  }

  if (dayjs(card.expirationDate, "MM/YY") < dayjs()) {
    throw unauthorizedError("Card expired!");
  }

  res.locals.card = card;

  next();
}
