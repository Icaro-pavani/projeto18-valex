import { Router } from "express";
import { createCard } from "../Controllers/cardsController.js";
import validApiKey from "../Middlewares/validApiKey.js";
import validEmployee from "../Middlewares/validEmployee.js";
import validSchema from "../Middlewares/validSchema.js";
import typeSchema from "../Schema/typeSchema.js";

const cardsRouter = Router();

cardsRouter.post(
  "/cards/create/:id",
  validApiKey,
  validEmployee,
  validSchema(typeSchema),
  createCard
);

export default cardsRouter;
