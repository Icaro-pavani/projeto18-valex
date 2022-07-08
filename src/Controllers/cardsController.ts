import { Request, Response } from "express";
import { Company } from "../repositories/companyRepository.js";
import { Employee } from "../repositories/employeeRepository.js";

export async function createCard(req: Request, res: Response) {
  const company: Company = res.locals.company;
  const employee: Employee = res.locals.employee;

  console.log(company, employee);
  res.sendStatus(200);
}
