const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const Contact = require("../models/contact");

const filePath = path.join(__dirname, "../data/contacts.json");
const MONGO_URI = process.env.MONGO_URI;

async function importContacts() {
  try {
    await mongoose.connect(MONGO_URI);
    const data = fs.readFileSync(filePath, "utf-8");
    const contacts = JSON.parse(data);

    await Contact.deleteMany(); // Очистка перед вставкою
    await Contact.insertMany(contacts);

    console.log("✅ Імпорт завершено успішно");
    process.exit(0);
  } catch (err) {
    console.error("❌ Помилка під час імпорту:", err);
    process.exit(1);
  }
}

importContacts();
