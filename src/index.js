import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactsRouter from './routes/contactsRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

export default app;
