import express from "express";
import cors from "cors";
import logger from "pino";
import contactsRouter from "./routers/contacts.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";

const log = logger();
const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});


app.use("/contacts", contactsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
