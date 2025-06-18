import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./server.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
console.log("ACCESS_TOKEN_SECRET =", process.env.ACCESS_TOKEN_SECRET);
console.log("REFRESH_TOKEN_SECRET =", process.env.REFRESH_TOKEN_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_URL,
  MONGODB_DB,
  PORT = 3000,
} = process.env;

const MONGODB_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Database connection successful");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection error:", error.message);
    process.exit(1);
  });
