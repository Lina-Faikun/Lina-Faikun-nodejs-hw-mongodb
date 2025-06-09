import Contact from '../models/contact.js';

export const getAllContacts = async ({ filter, skip, limit, sortBy, sortOrder }) => {
  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  const contacts = await Contact.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const totalItems = await Contact.countDocuments(filter);

  return { contacts, totalItems };
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContact = async (data) => {
  return await Contact.create(data);
};

export const updateContact = async (id, data) => {
  return await Contact.findByIdAndUpdate(id, data, { new: true });
};

export const deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
