// utils/redis.js
const redis = require('redis');
const { REDIS_HOST, REDIS_PORT } = require('../config/config'); // Adjust path as needed

class RedisClient {
  constructor() {
    this.client = redis.createClient({
      host: REDIS_HOST,  // Use environment variables for config
      port: REDIS_PORT,
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
    this.client.connect(); // Connect explicitly in the constructor
  }


  isAlive() {
    return this.client.isOpen; // Check isOpen instead of using a separate 'connect' handler
  }

  async get(key) {
    if (!this.isAlive()) {
      return null; 
    }
    const value = await this.client.get(key);
    return value;
  }

  async set(key, value, duration) {
    if (!this.isAlive()) {
      return;
    }
    await this.client.setEx(key, duration, value.toString());  // Convert value to string
  }



  async del(key) {
    if (!this.isAlive()) {
      return;
    }
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
