import { Router } from "express";
import { createCard } from "../Controllers/cardsController.js";
import validApiKey from "../Middlewares/validApiKey.js";
import validEmployee from "../Middlewares/validEmployee.js";

const cardsRouter = Router();

cardsRouter.post("/cards/create/:id", validApiKey, validEmployee, createCard);

export default cardsRouter;
