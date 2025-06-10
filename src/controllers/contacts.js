import * as contactsService from '../services/contacts.js';
import createError from 'http-errors';
import { parseQueryParams } from '../utils/parseQueryParams.js';

// GET /contacts
export const getAllContacts = async (req, res, next) => {
  try {
    const { page, limit, sortBy, sortOrder, filter } = parseQueryParams(req.query);
    const skip = (page - 1) * limit;

    const { contacts, totalItems } = await contactsService.getAllContacts({
      filter,
      skip,
      limit,
      sortBy,
      sortOrder,
      userId: req.user._id, 
    });

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page,
        perPage: limit,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /contacts/:contactId
export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsService.getContactById(contactId, req.user._id); // 🔑 userId
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
    const contactData = { ...req.body, userId: req.user._id }; 
    const newContact = await contactsService.createContact(contactData);
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
    const updatedContact = await contactsService.updateContact(contactId, req.body, req.user._id); // 🔑 userId
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
    const deleted = await contactsService.deleteContact(contactId, req.user._id); // 🔑 userId
    if (!deleted) {
      throw createError(404, 'Contact not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
