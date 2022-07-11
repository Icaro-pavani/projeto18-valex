import { Request, Response } from "express";
import {
  unauthorizedError,
  unprocessableError,
} from "../Middlewares/handleErrorsMiddleware.js";
import { Card, TransactionTypes } from "../repositories/cardRepository.js";

import { Employee } from "../repositories/employeeRepository.js";
import {
  blockUnblockCard,
  createCardForEmployee,
  createVirtualCardEmployee,
  deleteVirtualCardByPassword,
  transactionsBalanceByCardId,
  updateActivationCard,
} from "../Services/cardServices.js";

export async function createCard(req: Request, res: Response) {
  const employee: Employee = res.locals.employee;
  const { body } = res.locals;
  const type: TransactionTypes = body.type;

  const cardInfo = await createCardForEmployee(employee, type);
  res.status(201).send(cardInfo);
}

export async function activateCard(req: Request, res: Response) {
  const card: Card = res.locals.card;
  const { cvc, password }: { cvc: string; password: string } = res.locals.body;

  if (card.isVirtual) {
    throw unauthorizedError("It is a virtual card, it's already active!");
  }

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

export async function getCardTransations(req: Request, res: Response) {
  const cardId: number = parseInt(req.params.id);

  if (!cardId) {
    throw unprocessableError("Card id must be a number!");
  }

  const transationsBalance = await transactionsBalanceByCardId(cardId);

  res.status(200).send(transationsBalance);
}

export async function createVirtualCard(req: Request, res: Response) {
  const card: Card = res.locals.card;
  const { password }: { password: string } = res.locals.body;

  const cardInfo = await createVirtualCardEmployee(card, password);

  res.status(201).send(cardInfo);
}

export async function deleteVirtualCard(req: Request, res: Response) {
  const card: Card = res.locals.card;
  const { password }: { password: string } = res.locals.body;

  await deleteVirtualCardByPassword(card, password);

  res.sendStatus(200);
}
