import dotenv from 'dotenv';
import app from './server.js'; 
import { initMongoConnection } from './db/initMongoConnection.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

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

startServer();
