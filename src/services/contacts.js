import Contact from '../models/contact.js';

export const getAllContacts = async ({ filter, skip, limit, sortBy, sortOrder, userId }) => {
  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  const query = { ...filter, userId }; 

  const contacts = await Contact.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const totalItems = await Contact.countDocuments(query);

  return { contacts, totalItems };
};

export const getContactById = async (id, userId) => {
  return await Contact.findOne({ _id: id, userId }); 
};

export const createContact = async (data) => {
  return await Contact.create(data); 
};

export const updateContact = async (id, data, userId) => {
  return await Contact.findOneAndUpdate({ _id: id, userId }, data, { new: true }); // 🔑 userId
};

export const deleteContact = async (id, userId) => {
  return await Contact.findOneAndDelete({ _id: id, userId });
};
