import * as contactsService from '../services/contacts.js';
import createError from 'http-errors';

export const getAllContacts = async (req, res) => {
  const { page = 1, limit = 10, sortBy, sortByDesc, filter } = req.query;

  const paginationOptions = {
    page: parseInt(page),
    limit: parseInt(limit),
    sortBy,
    sortByDesc,
    filter,
  };

  const contacts = await contactsService.getAllContacts(paginationOptions);

  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved all contacts',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const contact = await contactsService.getContactById(req.params.contactId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Contact found successfully',
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const newContact = await contactsService.createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContact = async (req, res) => {
  const updatedContact = await contactsService.updateContact(req.params.contactId, req.body);
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContact = async (req, res) => {
  const result = await contactsService.deleteContact(req.params.contactId);
  if (!result) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send(); // No Content
};
