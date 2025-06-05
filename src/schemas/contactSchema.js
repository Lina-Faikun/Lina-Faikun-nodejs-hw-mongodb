import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(6).max(20).required(),
  contactType: Joi.string().valid('friend', 'family', 'work').required(),
  isFavourite: Joi.boolean().optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().min(6).max(20).optional(),
  contactType: Joi.string().valid('friend', 'family', 'work').optional(),
  isFavourite: Joi.boolean().optional(),
});
