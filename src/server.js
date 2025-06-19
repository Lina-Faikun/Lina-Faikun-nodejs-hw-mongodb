import express from "express";
import cors from "cors";
import logger from "pino";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocument = YAML.load("./docs/openapi.yaml");

import contactsRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";

const log = logger();
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});

app.use("/auth", authRouter);
app.use("/contacts", contactsRouter);

// Swagger route:
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
