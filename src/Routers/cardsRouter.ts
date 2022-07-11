import { Router } from "express";

import {
  activateCard,
  blockCard,
  createCard,
  createVirtualCard,
  deleteVirtualCard,
  getCardsInfo,
  getCardTransations,
  unblockCard,
} from "../Controllers/cardsController.js";
import validApiKey from "../Middlewares/validApiKey.js";
import validCard from "../Middlewares/validCard.js";
import validEmployee from "../Middlewares/validEmployee.js";
import validSchema from "../Middlewares/validSchema.js";
import activateCardSchema from "../Schema/activateCardSchema.js";
import cardInfoSchema from "../Schema/cardInfoSchema.js";
import passwordSchema from "../Schema/passwordSchema.js";
import typeSchema from "../Schema/typeSchema.js";

const cardsRouter = Router();

cardsRouter.post(
  "/cards/create/:id",
  validApiKey,
  validEmployee,
  validSchema(typeSchema),
  createCard
);

cardsRouter.post(
  "/cards/activate/:id",
  validSchema(activateCardSchema),
  validCard,
  activateCard
);

cardsRouter.post(
  "/cards/block/:id",
  validSchema(passwordSchema),
  validCard,
  blockCard
);

cardsRouter.post(
  "/cards/unblock/:id",
  validSchema(passwordSchema),
  validCard,
  unblockCard
);

cardsRouter.get("/cards/transactions/:id", getCardTransations);

cardsRouter.post(
  "/cards/virtual/create/:id",
  validSchema(passwordSchema),
  validCard,
  createVirtualCard
);

cardsRouter.delete(
  "/cards/delete-virtual/:id",
  validSchema(passwordSchema),
  validCard,
  deleteVirtualCard
);

cardsRouter.post(
  "/cards/cardInfo/:id",
  validSchema(cardInfoSchema),
  validCard,
  getCardsInfo
);

export default cardsRouter;
