import { Router } from "express";

import cardsRouter from "./cardsRouter.js";
import posRouter from "./posRouter.js";
import rechargeRouter from "./rechargeRouter.js";

const router = Router();

router.use(cardsRouter);
router.use(rechargeRouter);
router.use(posRouter);

export default router;
