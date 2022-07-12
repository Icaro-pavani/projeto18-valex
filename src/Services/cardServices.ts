import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.CRYPTRKEY);

import {
  conflictError,
  unauthorizedError,
  unprocessableError,
} from "../Middlewares/handleErrorsMiddleware.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { Employee } from "../repositories/employeeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

async function generateCardNumber(isVirtual: boolean) {
  let number = "";
  if (isVirtual) {
    number = faker.finance.creditCardNumber("mastercard").replace(/-/g, " ");
  } else {
    number = faker.finance.creditCardNumber("#### #### #### ####");
  }
  const cardWithNumber = await cardRepository.findByCardNumber(number);
  if (!cardWithNumber) {
    return number;
  }
  generateCardNumber(isVirtual);
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

async function createCardInfo(
  employeeId: number,
  employeeFullname: string,
  type: cardRepository.TransactionTypes,
  isVirtual: boolean,
  originalCardId: number | null = null
) {
  const yearsToExpirate = 5;

  const number = await generateCardNumber(isVirtual);
  const cvcNumber = faker.finance.creditCardCVV();
  const securityCode = cryptr.encrypt(cvcNumber);
  const cardholderName = formatName(employeeFullname);
  const expirationDate = dayjs().add(yearsToExpirate, "year").format("MM/YY");

  const cardInfo: cardRepository.CardInsertData = {
    employeeId,
    number,
    cardholderName,
    securityCode,
    expirationDate,
    password: null,
    isVirtual,
    originalCardId,
    isBlocked: false,
    type,
  };

  return cardInfo;
}

export async function createCardForEmployee(
  employee: Employee,
  type: cardRepository.TransactionTypes
) {
  const isVirtual = false;

  const cardCreated = await cardRepository.findByTypeAndEmployeeId(
    type,
    employee.id
  );
  if (cardCreated) {
    throw conflictError("The employee already has this type of card");
  }

  const cardInfo = await createCardInfo(
    employee.id,
    employee.fullName,
    type,
    isVirtual
  );

  await cardRepository.insert(cardInfo);

  return {
    number: cardInfo.number,
    cardholderName: cardInfo.cardholderName,
    cvc: cryptr.decrypt(cardInfo.securityCode),
    type,
  };
}

export async function updateActivationCard(
  card: cardRepository.Card,
  password: string,
  cvc: string
) {
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

export async function createVirtualCardEmployee(
  card: cardRepository.Card,
  password: string
) {
  const isVirtual = true;

  if (!bcrypt.compareSync(password, card.password)) {
    throw unauthorizedError("Wrong password!");
  }

  const cardInfo = await createCardInfo(
    card.employeeId,
    card.cardholderName,
    card.type,
    isVirtual,
    card.id
  );
  cardInfo.cardholderName = card.cardholderName;
  cardInfo.password = card.password;

  await cardRepository.insert(cardInfo);

  return {
    number: cardInfo.number,
    cardholderName: cardInfo.cardholderName,
    cvc: cryptr.decrypt(cardInfo.securityCode),
    expirationDate: cardInfo.expirationDate,
    type: card.type,
  };
}

export async function deleteVirtualCardByPassword(
  card: cardRepository.Card,
  password: string
) {
  if (!bcrypt.compareSync(password, card.password)) {
    throw unauthorizedError("Wrong password!");
  }

  if (!card.isVirtual) {
    throw unauthorizedError("It is not a virtual card!");
  }

  await cardRepository.remove(card.id);
}

export function getCardInfoByIdAndPassword(
  card: cardRepository.Card,
  cardPassword: string,
  employeeId: number
) {
  if (!employeeId) {
    throw unprocessableError("employeeId must be a number!");
  }

  if (employeeId !== card.employeeId) {
    throw unauthorizedError("This card doesn't belong to this employee!");
  }

  if (!card.password) {
    throw unauthorizedError("Card not active!");
  }

  if (!bcrypt.compareSync(cardPassword, card.password)) {
    return [];
  }

  const cardArray = [
    {
      number: card.number,
      cardholderName: card.cardholderName,
      expirationDate: card.expirationDate,
      securityCode: cryptr.decrypt(card.securityCode),
    },
  ];

  return cardArray;
}
