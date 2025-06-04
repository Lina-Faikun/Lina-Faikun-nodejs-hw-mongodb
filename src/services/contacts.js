import Contact from '../models/contact.js';

export const getAllContacts = async ({ page, limit, sortBy, sortByDesc, filter }) => {
  const skip = (page - 1) * limit;

  // Формування об'єкту сортування
  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = 1;
  } else if (sortByDesc) {
    sortOptions[sortByDesc] = -1;
  }

  // Вибір лише певних полів (наприклад name,email)
  const selectFields = filter ? filter.split(',').join(' ') : '';

  const contacts = await Contact.find({}, selectFields)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  return contacts;
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

export const updateContact = async (id, contactData) => {
  return await Contact.findByIdAndUpdate(id, contactData, { new: true });
};

export const deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
