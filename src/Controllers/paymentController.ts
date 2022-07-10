import { Request, Response } from "express";
import { Card } from "../repositories/cardRepository";

export async function paymentInPOS(req: Request, res: Response) {
  const card: Card = res.locals.card;
  const {
    businessId,
    amount,
    cardPassword,
  }: { businessId: number; amount: number; cardPassword: string } =
    res.locals.body;
}
