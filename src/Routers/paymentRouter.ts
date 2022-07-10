import { Router } from "express";
import { paymentInPOS } from "../Controllers/paymentController.js";

import validCard from "../Middlewares/validCard.js";
import validSchema from "../Middlewares/validSchema.js";
import paymentSchema from "../Schema/paymentSchema.js";

const paymentRouter = Router();

paymentRouter.post(
  "/payment/:id",
  validCard,
  validSchema(paymentSchema),
  paymentInPOS
);

export default paymentRouter;
