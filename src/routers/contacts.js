import express from 'express';
import * as contactsController from '../controllers/contacts.js';
import validateQuery from '../middlewares/validateQuery.js'; 

const router = express.Router();

router.get('/', validateQuery, contactsController.getAllContacts);
router.get('/:contactId', contactsController.getContactById);
router.post('/', contactsController.createContact);
router.patch('/:contactId', contactsController.updateContact);
router.delete('/:contactId', contactsController.deleteContact);

export default router;
