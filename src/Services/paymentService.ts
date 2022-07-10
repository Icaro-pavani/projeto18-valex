import bcrypt from "bcrypt";

import {
  unauthorizedError,
  unprocessableError,
} from "../Middlewares/handleErrorsMiddleware.js";
import * as businessRepository from "../repositories/businessRepository.js";
import { Card } from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import { transactionsBalanceByCardId } from "./cardServices.js";

export async function businessPayment(
  businessId: number,
  amount: number,
  cardPassword: string,
  card: Card
) {
  if (!card.password) {
    throw unauthorizedError("The card is unactive!");
  }
  if (card.isBlocked) {
    throw unauthorizedError("The card ios blocked!");
  }

  const business = await businessRepository.findById(businessId);
  if (!business) {
    throw unprocessableError("No businees registred with this id!");
  }
  if (business.type !== card.type) {
    throw unauthorizedError("Card and business with different types!");
  }

  if (!bcrypt.compareSync(cardPassword, card.password)) {
    throw unauthorizedError("Wrong password!");
  }
  const transactionsBalance = await transactionsBalanceByCardId(card.id);

  if (transactionsBalance.balance < amount) {
    throw unauthorizedError("Insufficient balance!");
  }

  const paymentInfo: paymentRepository.PaymentInsertData = {
    cardId: card.id,
    businessId,
    amount,
  };

  await paymentRepository.insert(paymentInfo);
}
