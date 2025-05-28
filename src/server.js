
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactsRouter from './routes/contactsRoutes.js';
import { initMongoConnection } from './db/initMongoConnection.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Тестовий маршрут
app.get('/contacts/test', (req, res) => {
  try {
    res.json({ message: 'Test route works!' });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ status: 500, message: error.message, data: null });
  }
});

// Підключення роутера для контактів
app.use('/contacts', contactsRouter);

// Middleware для 404 (повинен бути **після** всіх маршрутів)
app.get('/', (req, res) => {
  res.send('Welcome to Contacts API 🎉');
});

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Route not found',
    data: null,
  });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
    data: null,
  });
});

export default app;