import { Router } from "express";
import {
  onlinePayment,
  paymentInPOS,
} from "../Controllers/paymentController.js";

import validCard from "../Middlewares/validCard.js";
import validSchema from "../Middlewares/validSchema.js";
import onlinePaymentSchema from "../Schema/onlinePaymentSchema.js";
import paymentSchema from "../Schema/paymentSchema.js";

const paymentRouter = Router();

paymentRouter.post(
  "/payment/:id",
  validCard,
  validSchema(paymentSchema),
  paymentInPOS
);

paymentRouter.post(
  "/payment/online/:id",
  validSchema(onlinePaymentSchema),
  onlinePayment
);

export default paymentRouter;
