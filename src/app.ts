import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "express-async-errors";

import router from "./Routers/index.js";
import handleErrors from "./Middlewares/handleErrorsMiddleware.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);
app.use(handleErrors);

const port: number = +process.env.PORT || 5000;

app.listen(port, () => console.log(`Server online on port ${port}`));
