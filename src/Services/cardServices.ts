import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";

import {
  conflictError,
  unauthorizedError,
} from "../Middlewares/handleErrorsMiddleware.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { Employee } from "../repositories/employeeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

async function generateCardNumber() {
  const number = faker.finance.creditCardNumber("#### #### #### ####");
  const cardWithNumber = await cardRepository.findByCardNumber(number);
  if (!cardWithNumber) {
    return number;
  }
  generateCardNumber();
}

function formatName(name: string) {
  const minNameLength = 3;
  const separatedName = name
    .split(" ")
    .filter((name) => name.length >= minNameLength);
  const formatedName: string[] = [];
  for (let i = 0; i < separatedName.length; i++) {
    if (i === 0 || i === separatedName.length - 1) {
      formatedName.push(separatedName[i]);
    } else {
      formatedName.push(separatedName[i][0]);
    }
  }

  return formatedName.join(" ");
}

export async function createCardForEmployee(
  employee: Employee,
  type: cardRepository.TransactionTypes
) {
  const yearsToExpirate = 5;
  const cryptr = new Cryptr(process.env.CRYPTRKEY);

  const cardCreated = await cardRepository.findByTypeAndEmployeeId(
    type,
    employee.id
  );
  if (cardCreated) {
    throw conflictError("The employee already has this type of card");
  }

  const cardNumber = await generateCardNumber();
  const cvcNumber = faker.finance.creditCardCVV();
  const cryptedCvcNumber = cryptr.encrypt(cvcNumber);
  const cardName = formatName(employee.fullName);
  const expirationDate = dayjs().add(yearsToExpirate, "year").format("MM/YY");

  const cardInfo: cardRepository.CardInsertData = {
    employeeId: employee.id,
    number: cardNumber,
    cardholderName: cardName,
    securityCode: cryptedCvcNumber,
    expirationDate,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: false,
    type,
  };

  await cardRepository.insert(cardInfo);

  console.log(cvcNumber); //to know the value of the CVC of the card for other routes
}

export async function updateActivationCard(
  card: cardRepository.Card,
  password: string,
  cvc: string
) {
  const cryptr = new Cryptr(process.env.CRYPTRKEY);
  if (cvc !== cryptr.decrypt(card.securityCode)) {
    throw unauthorizedError("CVC doesn't match!");
  }
  if (card.password) {
    throw unauthorizedError("Card already activated");
  }

  const SALT: number = 10;
  const hashPassword = bcrypt.hashSync(password, SALT);
  const activationInfo: cardRepository.CardUpdateData = {
    password: hashPassword,
    isBlocked: false,
  };

  await cardRepository.update(card.id, activationInfo);
}

export async function blockUnblockCard(
  card: cardRepository.Card,
  password: string,
  block: boolean
) {
  if (!!block) {
    if (!!card.isBlocked) {
      throw unauthorizedError("Card is blocked already!");
    }
  } else {
    if (!card.isBlocked) {
      throw unauthorizedError("Card is currently unblocked");
    }
  }

  if (!card.password) {
    throw unauthorizedError("Card must be active to be blocked!");
  }

  if (!bcrypt.compareSync(password, card.password)) {
    throw unauthorizedError("Wrong password!");
  }

  const blockCardData: cardRepository.CardUpdateData = {
    isBlocked: block,
  };

  await cardRepository.update(card.id, blockCardData);
}

export async function transactionsBalanceByCardId(cardId: number) {
  const transactionsResult = await paymentRepository.findByCardId(cardId);
  const rechargesResult = await rechargeRepository.findByCardId(cardId);

  let balance = 0;
  const transactions = transactionsResult.map((transaction) => {
    balance -= transaction.amount;
    return {
      ...transaction,
      timestamp: dayjs(transaction.timestamp).format("DD/MM/YYYY"),
    };
  });
  const recharges = rechargesResult.map((recharge) => {
    balance += recharge.amount;
    return {
      ...recharge,
      timestamp: dayjs(recharge.timestamp).format("DD/MM/YYYY"),
    };
  });

  const transactionsBalance = {
    balance,
    transactions,
    recharges,
  };

  return transactionsBalance;
}
