import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";

import { Company } from "../repositories/companyRepository.js";
import { Employee } from "../repositories/employeeRepository.js";
import { createCardForEmployee } from "../Services/cardServices.js";

export async function createCard(req: Request, res: Response) {
  const company: Company = res.locals.company;
  const employee: Employee = res.locals.employee;
  const { body } = res.locals;
  const type: TransactionTypes = body.type;

  await createCardForEmployee(company, employee, type);
  res.sendStatus(200);
}
