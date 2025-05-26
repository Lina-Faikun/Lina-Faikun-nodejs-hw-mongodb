import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const initMongoConnection = async () => {
  const uri = process.env.MONGO_URL;

  if (!uri) throw new Error('MongoDB URI is not defined in .env');

  await mongoose.connect(uri);
  console.log('MongoDB connected');
};
