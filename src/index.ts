import app from './app';
import { connectDatabase } from './config';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
