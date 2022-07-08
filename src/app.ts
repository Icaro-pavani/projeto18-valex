import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const port: number = +process.env.PORT || 5000;

app.listen(port, () => console.log(`Server online on port ${port}`));
