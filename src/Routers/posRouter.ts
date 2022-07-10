import { Router } from "express";

import validCard from "../Middlewares/validCard.js";
import validSchema from "../Middlewares/validSchema.js";
import paymentSchema from "../Schema/paymentSchema.js";

const posRouter = Router();

posRouter.post("/payment/:id", validCard, validSchema(paymentSchema));

export default posRouter;
