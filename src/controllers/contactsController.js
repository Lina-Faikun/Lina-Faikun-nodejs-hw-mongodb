import * as contactService from '../services/contactsService.js';

export const getAllContacts = async (req, res, next) => {
  const contacts = await contactService.listContacts();
  res.json(contacts);
};

export const getContactById = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactService.getContactById(id);
  if (!contact) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(contact);
};

export const createContact = async (req, res, next) => {
  const newContact = await contactService.addContact(req.body);
  res.status(201).json(newContact);
};

export const updateContactById = async (req, res, next) => {
  const { id } = req.params;
  const updated = await contactService.updateContact(id, req.body);
  if (!updated) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(updated);
};

export const deleteContactById = async (req, res, next) => {
  const { id } = req.params;
  const deleted = await contactService.removeContact(id);
  if (!deleted) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json({ message: 'Contact deleted' });
};
