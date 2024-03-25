import express from "express";
import { Request, Response } from "express";
import authRouter from "./routes/auth-router";
import ErrorHandler from "./middleware/error-handler";

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/auth", authRouter);

app.use(ErrorHandler);

app.listen(port, () => {
  console.log("server is running on port " + port);
});
