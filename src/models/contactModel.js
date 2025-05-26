import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
}, { timestamps: true });

export default mongoose.model('Contact', contactSchema);
