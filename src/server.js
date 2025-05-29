import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";

import contactsRouter from "./routers/contacts.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/contacts", contactsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const { DB_HOST, PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });