import express from "express";
import authRouter from "./routes/auth-router";
import ErrorHandler from "./middleware/error-handler";
import swaggerUi from "swagger-ui-express";
import eventRouter from "./routes/event-router";
import bodyParser from "body-parser";
import purchaseRouter from "./routes/purchase-router";
import citiesRouter from "./routes/cities-router";
import cors from "cors";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(
  cors({
    origin: ["https://localhost:3000", "https://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

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
app.use("/cities", citiesRouter);

app.use(ErrorHandler);

app.listen(port, () => {
  console.log("server is running on port " + port);
});
