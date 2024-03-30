import express from "express";
import authRouter from "./routes/auth-router";
import ErrorHandler from "./middleware/error-handler";
import swaggerUi from "swagger-ui-express";
import eventRouter from "./routes/event-router";
import bodyParser from "body-parser";
import purchaseRouter from "./routes/purchase-router";

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.use("/auth", authRouter);
app.use("/event", eventRouter);
app.use("/purchase", purchaseRouter);

app.use(ErrorHandler);

app.listen(port, () => {
  console.log("server is running on port " + port);
});
