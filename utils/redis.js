import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Create and initialize the Redis client
    this.client = createClient();

    // Handle Redis connection errors
    this.client.on('error', (err) => console.error(`Redis Client Error: ${err}`));

    // Ensure the client is connected before performing any operations
    this.client.connect().then(() => {
      console.log('Redis client connected');
    }).catch((err) => {
      console.error(`Failed to connect to Redis: ${err}`);
    });
  }

  // Check if the Redis client is alive and connected
  isAlive() {
    return this.client.isOpen;
  }

  // Asynchronously get the value of a given key from Redis
  async get(key) {
    try {
      return await this.client.get(key);
    } catch (err) {
      console.error(`Error getting key ${key}: ${err}`);
      return null;
    }
  }

  // Asynchronously set a value for a given key with an expiration duration
  async set(key, value, duration) {
    try {
      await this.client.set(key, value, {
        EX: duration, // Set expiration time in seconds
      });
    } catch (err) {
      console.error(`Error setting key ${key}: ${err}`);
    }
  }

  // Asynchronously delete a key-value pair from Redis
  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error(`Error deleting key ${key}: ${err}`);
    }
  }
}

// Export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;

