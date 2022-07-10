import * as rechargeRepository from "../repositories/rechargeRepository.js";

export async function rechargeAmountToCard(cardId: number, amount: number) {
  const addRechargeInfo: rechargeRepository.RechargeInsertData = {
    cardId,
    amount,
  };
  await rechargeRepository.insert(addRechargeInfo);
}
