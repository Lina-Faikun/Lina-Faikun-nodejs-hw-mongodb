import Contact from '../models/contact.js';

export const getAllContacts = async ({ page, limit, sortBy, sortOrder, isFavourite, contactType }) => {
  const skip = (page - 1) * limit;

  const filter = {};
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }
  if (contactType) {
    filter.contactType = contactType;
  }

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
