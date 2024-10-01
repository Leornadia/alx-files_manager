import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Create a Redis client
    this.client = createClient();
    
    // Display any Redis client errors in the console
    this.client.on('error', (err) => console.error(`Redis Client Error: ${err}`));

    // Connect the client (Redis 4.x requires explicit connection)
    this.client.connect().then(() => {
      console.log('Redis client connected');
    }).catch((err) => {
      console.error(`Failed to connect to Redis: ${err}`);
    });
  }

  // Function to check if Redis connection is alive
  isAlive() {
    return this.client.isOpen;
  }

  // Asynchronous function to get a value by key
  async get(key) {
    try {
      return await this.client.get(key);
    } catch (err) {
      console.error(`Error getting key ${key}: ${err}`);
      return null;
    }
  }

  // Asynchronous function to set a value with expiration time (in seconds)
  async set(key, value, duration) {
    try {
      await this.client.set(key, value, {
        EX: duration // Set expiration time in seconds
      });
    } catch (err) {
      console.error(`Error setting key ${key}: ${err}`);
    }
  }

  // Asynchronous function to delete a key-value pair
  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error(`Error deleting key ${key}: ${err}`);
    }
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;

