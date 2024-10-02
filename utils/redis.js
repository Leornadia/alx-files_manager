import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    // Create a Redis client
    this.client = createClient();

    // Display any Redis client errors in the console
    this.client.on('error', (err) => console.error(`Redis Client Error: ${err}`));

    // Promisify Redis commands for easier usage with async/await
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  // Function to check if Redis connection is alive
  isAlive() {
    return this.client.connected;
  }

  // Asynchronous function to get a value by key
  async get(key) {
    return await this.getAsync(key);
  }

  // Asynchronous function to set a value with expiration time (in seconds)
  async set(key, value, duration) {
    await this.setAsync(key, value, 'EX', duration);
  }

  // Asynchronous function to delete a key-value pair
  async del(key) {
    await this.delAsync(key);
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;

