import { Request, Response } from "express";
import { Card, TransactionTypes } from "../repositories/cardRepository.js";

import { Company } from "../repositories/companyRepository.js";
import { Employee } from "../repositories/employeeRepository.js";
import {
  blockActivatedCard,
  createCardForEmployee,
  updateActivationCard,
} from "../Services/cardServices.js";

export async function createCard(req: Request, res: Response) {
  const company: Company = res.locals.company;
  const employee: Employee = res.locals.employee;
  const { body } = res.locals;
  const type: TransactionTypes = body.type;

  await createCardForEmployee(company, employee, type);
  res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response) {
  const card: Card = res.locals.card;
  const { cvc, password }: { cvc: string; password: string } = res.locals.body;

  await updateActivationCard(card, password, cvc);

  res.sendStatus(200);
}

export async function blockCard(req: Request, res: Response) {
  const card: Card = res.locals.card;
  const { password }: { password: string } = res.locals.body;

  await blockActivatedCard(card, password);

  res.sendStatus(200);
}
