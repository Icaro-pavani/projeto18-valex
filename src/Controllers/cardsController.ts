import { Request, Response } from "express";
import { Card, TransactionTypes } from "../repositories/cardRepository.js";

import { Company } from "../repositories/companyRepository.js";
import { Employee } from "../repositories/employeeRepository.js";
import {
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
  const password: string = res.locals.body.password;

  await updateActivationCard(card.id, password);

  res.sendStatus(200);
}