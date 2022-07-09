import { Router } from "express";

import {
  activateCard,
  blockCard,
  createCard,
} from "../Controllers/cardsController.js";
import validApiKey from "../Middlewares/validApiKey.js";
import validCard from "../Middlewares/validCard.js";
import validEmployee from "../Middlewares/validEmployee.js";
import validSchema from "../Middlewares/validSchema.js";
import activateCardSchema from "../Schema/activateCardSchema.js";
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

export default cardsRouter;
