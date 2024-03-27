import express from "express";
import authRouter from "./routes/auth-router";
import ErrorHandler from "./middleware/error-handler";
import swaggerUi from "swagger-ui-express";
import eventRouter from "./routes/event-router";

const app = express();
const port = process.env.PORT;

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

app.use(ErrorHandler);

app.listen(port, () => {
  console.log("server is running on port " + port);
});
