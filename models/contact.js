const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, default: null },
  isFavourite: { type: Boolean, default: false },
  contactType: {
    type: String,
    enum: ["personal", "home"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = model("Contact", contactSchema);
