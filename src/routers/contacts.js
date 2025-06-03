import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';

const router = express.Router();

// Лог для перевірки, що маршрут отримано
router.get('/', (req, res, next) => {
  console.log('GET /contacts received');
  next();
}, getAllContacts);

router.get('/:contactId', getContactById);
router.post('/', createContact);
router.patch('/:contactId', updateContact);
router.delete('/:contactId', deleteContact);

export default router;
