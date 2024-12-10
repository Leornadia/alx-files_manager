const redis = require('redis');

class RedisClient {
  constructor() {
    // Create a Redis client
    this.client = redis.createClient();

    // Handle Redis client errors
    this.client.on('error', (err) => {
      console.error(`Redis error: ${err}`);
    });
  }

  // Check if the Redis client is alive
  isAlive() {
    return this.client.connected;
  }

  // Get a value from Redis by key
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  // Set a value in Redis with an expiration time
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Delete a value from Redis by key
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
