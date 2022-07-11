import { Request, Response } from "express";
import { unauthorizedError } from "../Middlewares/handleErrorsMiddleware.js";

import { Card } from "../repositories/cardRepository.js";
import { Company } from "../repositories/companyRepository.js";
import { employeeIdValidation } from "../Services/employeeServices.js";
import { rechargeAmountToCard } from "../Services/rechargeServices.js";

export async function rechargeCard(req: Request, res: Response) {
  const company: Company = res.locals.company;
  const card: Card = res.locals.card;
  const { amount }: { amount: number } = res.locals.body;

  const employee = await employeeIdValidation(card.employeeId, company.id);

  if (card.isVirtual) {
    throw unauthorizedError("It is a virtual card!");
  }

  if (!card.password) {
    throw unauthorizedError("This card is not active!");
  }

  await rechargeAmountToCard(card.id, amount);

  res.sendStatus(201);
}
