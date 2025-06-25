import { Types } from 'mongoose';
import createError from 'http-errors';

const validateId = (req, res, next) => {
  const { contactId } = req.params;
  if (!Types.ObjectId.isValid(contactId)) {
    return next(createError(400, 'Invalid contact ID'));
  }
  next();
};

export default validateId;
