import { Router } from "express";
import { rechargeCard } from "../Controllers/rechargeController.js";

import validApiKey from "../Middlewares/validApiKey.js";
import validCard from "../Middlewares/validCard.js";
import validSchema from "../Middlewares/validSchema.js";
import rechargeSchema from "../Schema/rechargeSchema.js";

const rechargeRouter = Router();

rechargeRouter.post(
  "/recharge/:id",
  validApiKey,
  validCard,
  validSchema(rechargeSchema),
  rechargeCard
);

export default rechargeRouter;
