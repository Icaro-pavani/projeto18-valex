import bcrypt from "bcrypt";
import Cryptr from "cryptr";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(customParseFormat);

import {
  unauthorizedError,
  unprocessableError,
} from "../Middlewares/handleErrorsMiddleware.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import { transactionsBalanceByCardId } from "./cardServices.js";

async function validateBusiness(businessId: number, cardType: string) {
  const business = await businessRepository.findById(businessId);
  if (!business) {
    throw unprocessableError("No businees registred with this id!");
  }
  if (business.type !== cardType) {
    throw unauthorizedError("Card and business with different types!");
  }
}

async function persistPayment(
  cardId: number,
  businessId: number,
  amount: number
) {
  const transactionsBalance = await transactionsBalanceByCardId(cardId);

  if (transactionsBalance.balance < amount) {
    throw unauthorizedError("Insufficient balance!");
  }

  const paymentInfo: paymentRepository.PaymentInsertData = {
    cardId,
    businessId,
    amount,
  };
  await paymentRepository.insert(paymentInfo);
}

export async function businessPayment(
  businessId: number,
  amount: number,
  cardPassword: string,
  card: cardRepository.Card
) {
  if (!card.password) {
    throw unauthorizedError("The card is unactive!");
  }
  if (card.isBlocked) {
    throw unauthorizedError("The card ios blocked!");
  }

  await validateBusiness(businessId, card.type);

  if (!bcrypt.compareSync(cardPassword, card.password)) {
    throw unauthorizedError("Wrong password!");
  }

  await persistPayment(card.id, businessId, amount);
}

export async function onlineBusinessPayment(
  businessId: number,
  cardNumber: string,
  ownerName: string,
  expirationDate: string,
  cvc: string,
  amount: number
) {
  const cryptr = new Cryptr(process.env.CRYPTRKEY);
  const card = await cardRepository.findByCardDetails(
    cardNumber,
    ownerName,
    expirationDate
  );

  if (!card) {
    throw unprocessableError("Incorrect card information!");
  }
  if (card.isBlocked || !card.password) {
    throw unauthorizedError("Card blocked or unactive!");
  }
  if (dayjs(card.expirationDate, "MM/YY") < dayjs()) {
    throw unauthorizedError("Card expired!");
  }
  if (cvc !== cryptr.decrypt(card.securityCode)) {
    throw unauthorizedError("CVC doesn't match!");
  }

  await validateBusiness(businessId, card.type);

  if (card.isVirtual) {
    await persistPayment(card.originalCardId, businessId, amount);
  } else {
    await persistPayment(card.id, businessId, amount);
  }
}
