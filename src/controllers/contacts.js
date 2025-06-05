import * as contactsService from '../services/contacts.js';
import createError from 'http-errors';

// GET /contacts
export const getAllContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      isFavourite,
      contactType, 
    } = req.query;

    const paginationOptions = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder,
      isFavourite,
      contactType, 
    };

    const contacts = await contactsService.getAllContacts(paginationOptions);

    res.status(200).json({
      status: 200,
      message: 'Successfully retrieved all contacts',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// GET /contacts/:contactId
export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsService.getContactById(contactId);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Contact found',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// POST /contacts
export const createContact = async (req, res, next) => {
  try {
    const newContact = await contactsService.createContact(req.body);
    res.status(201).json({
      status: 201,
      message: 'Contact created',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /contacts/:contactId
export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await contactsService.updateContact(contactId, req.body);
    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Contact updated',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /contacts/:contactId
export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleted = await contactsService.deleteContact(contactId);
    if (!deleted) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Contact deleted',
    });
  } catch (error) {
    next(error);
  }
};
