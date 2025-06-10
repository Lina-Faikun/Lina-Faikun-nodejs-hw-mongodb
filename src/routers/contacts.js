import express from "express";
import * as contactsController from "../controllers/contacts.js";
import validateId from "../middlewares/validateId.js";
import validateBody from "../middlewares/validateBody.js";
import { contactSchema, updateContactSchema } from "../schemas/contactSchema.js";
import authenticate from "../middlewares/authenticate.js"; 

const router = express.Router();

router.use(authenticate); 

router.get("/", contactsController.getAllContacts);
router.get("/:contactId", validateId, contactsController.getContactById);
router.post("/", validateBody(contactSchema), contactsController.createContact);
router.patch("/:contactId", validateId, validateBody(updateContactSchema), contactsController.updateContact);
router.delete("/:contactId", validateId, contactsController.deleteContact);

export default router;
