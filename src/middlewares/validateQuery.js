import Joi from 'joi';
import createError from 'http-errors';

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sortBy: Joi.string().valid('name', 'email', 'phoneNumber', 'contactType', 'isFavourite').optional(),
  isFavourite: Joi.boolean(),
  sortByDesc: Joi.string().valid('name', 'email', 'phoneNumber', 'contactType', 'isFavourite').optional(),
  filter: Joi.string()
    .pattern(/^([a-zA-Z]+)(,[a-zA-Z]+)*$/)
    .optional(),
});

const validateQuery = (req, res, next) => {
  const { error } = querySchema.validate(req.query);
  if (error) {
    return next(createError(400, `Invalid query: ${error.message}`));
  }
  next();
};

export default validateQuery;
