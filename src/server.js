
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

// ⚠️ БЕЗ /api
app.use('/contacts', contactsRouter);

// Not found middleware
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Route not found',
    data: null
  });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
    data: null
  });
});

// Start server
async function startServer() {
  try {
    await initMongoConnection();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}


export default app;