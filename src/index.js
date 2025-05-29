import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./server.js";

dotenv.config();

const { DB_URI, PORT = 3000 } = process.env;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("✅ Database connection successful");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  });
