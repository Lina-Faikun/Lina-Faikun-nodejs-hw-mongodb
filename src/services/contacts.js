const Contact = require("../models/contact");

const listContacts = () => Contact.find();
const getContactById = (id) => Contact.findById(id);
const addContact = (body) => Contact.create(body);
const updateContact = (id, body) => Contact.findByIdAndUpdate(id, body, { new: true });
const removeContact = (id) => Contact.findByIdAndDelete(id);

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
