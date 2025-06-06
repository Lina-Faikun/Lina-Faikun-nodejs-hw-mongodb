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
