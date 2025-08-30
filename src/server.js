import express from "express";
import cors from "cors";
import logger from "pino";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join("docs", "swagger.json"), "utf8")
);

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


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
