// utils/config.js
import dotenv from 'dotenv';

dotenv.config();

const config = {
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT || 27017,
  dbDatabase: process.env.DB_DATABASE || 'files_manager',
  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  redisPort: process.env.REDIS_PORT || 6379,
  // Add other configuration values as needed
};

export default config;
