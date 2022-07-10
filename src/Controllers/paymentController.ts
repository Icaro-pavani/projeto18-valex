import { Request, Response } from "express";
import { unprocessableError } from "../Middlewares/handleErrorsMiddleware.js";
import { Card } from "../repositories/cardRepository.js";
import {
  businessPayment,
  onlineBusinessPayment,
} from "../Services/paymentService.js";

export async function paymentInPOS(req: Request, res: Response) {
  const card: Card = res.locals.card;
  const {
    businessId,
    amount,
    cardPassword,
  }: { businessId: number; amount: number; cardPassword: string } =
    res.locals.body;

  await businessPayment(businessId, amount, cardPassword, card);

  res.sendStatus(201);
}

export async function onlinePayment(req: Request, res: Response) {
  const {
    cardNumber,
    ownerName,
    expirationDate,
    cvc,
    amount,
  }: {
    cardNumber: string;
    ownerName: string;
    expirationDate: string;
    cvc: string;
    amount: number;
  } = res.locals.body;
  const businessId: number = parseInt(req.params.id);

  if (!businessId) {
    throw unprocessableError("The id must be an integer number!");
  }

  await onlineBusinessPayment(
    businessId,
    cardNumber,
    ownerName,
    expirationDate,
    cvc,
    amount
  );

  res.sendStatus(201);
}
