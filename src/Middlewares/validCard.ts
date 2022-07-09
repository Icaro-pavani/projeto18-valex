import { NextFunction, Request, Response } from "express";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import Cryptr from "cryptr";

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
  const cryptr = new Cryptr(process.env.CRYPTRKEY);
  const cvc: string = req.body.cvc;

  const id: number = parseInt(req.params.id);
  if (!id) {
    throw unprocessableError("The id must be a number!");
  }

  const card = await cardRepository.findById(id);
  if (!card) {
    throw unprocessableError("There ins't a card with this id!");
  }

  if (dayjs(card.expirationDate, "MM/YY") < dayjs()) {
    throw unauthorizedError("Card expired!");
  }

  if (card.password) {
    throw unauthorizedError("Card already activated");
  }

  if (cvc !== cryptr.decrypt(card.securityCode)) {
    throw unauthorizedError("CVC doesn't match!");
  }

  res.locals.card = card;

  next();
}
