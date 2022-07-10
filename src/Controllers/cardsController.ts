import { Request, Response } from "express";
import { Card, TransactionTypes } from "../repositories/cardRepository.js";

import { Employee } from "../repositories/employeeRepository.js";
import {
  blockUnblockCard,
  createCardForEmployee,
  updateActivationCard,
} from "../Services/cardServices.js";

export async function createCard(req: Request, res: Response) {
  const employee: Employee = res.locals.employee;
  const { body } = res.locals;
  const type: TransactionTypes = body.type;

  await createCardForEmployee(employee, type);
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
  const isToBlock = true;

  await blockUnblockCard(card, password, isToBlock);

  res.sendStatus(200);
}

export async function unblockCard(req: Request, res: Response) {
  const card: Card = res.locals.card;
  const { password }: { password: string } = res.locals.body;
  const isToBlock = false;

  await blockUnblockCard(card, password, isToBlock);

  res.sendStatus(200);
}
