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

  return contacts;
};

// Отримати контакт за ID
export const getContactById = async (id) => {
  return await Contact.findById(id);
};

// Створити новий контакт
export const createContact = async (data) => {
  return await Contact.create(data);
};

// Оновити контакт
export const updateContact = async (id, data) => {
  return await Contact.findByIdAndUpdate(id, data, { new: true });
};

// Видалити контакт
export const deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
