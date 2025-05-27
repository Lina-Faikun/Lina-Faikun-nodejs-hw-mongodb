
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Invalid email format'],
  },
  phone: {
    type: String,
    required: true,
    match: [/^\+?[0-9\s\-]{7,15}$/, 'Invalid phone number format'],
  },
}, {
  timestamps: true,
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
