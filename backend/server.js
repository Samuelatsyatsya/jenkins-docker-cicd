import dotenv from 'dotenv';
import { testConnection, sequelize } from './src/config/db.js';
import app from './src/app.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;

async function startServer() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Sync database models
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database models synchronized');
    }

    // Start server
    app.listen(PORT, HOST, () => {
      console.log(`
Server is running!
Environment: ${process.env.NODE_ENV}
Host: http://${HOST}:${PORT}
Health: http://${HOST}:${PORT}/health
API: http://${HOST}:${PORT}${process.env.API_PREFIX || '/api/v1'}
Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

startServer();