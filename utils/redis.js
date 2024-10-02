import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
    constructor() {
        // Create Redis client
        this.client = redis.createClient();

        // Display error messages
        this.client.on('error', (err) => {
            console.error(`Redis client error: ${err}`);
        });

        // Promisify the Redis client methods for async/await usage
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);
    }

    // Check if Redis client is connected
    isAlive() {
        return this.client.connected;
    }

    // Asynchronously get a value from Redis
    async get(key) {
        try {
            const value = await this.getAsync(key);
            return value;
        } catch (err) {
            console.error(`Error getting key ${key}: ${err}`);
            return null;
        }
    }

    // Asynchronously set a key with a value and expiration duration
    async set(key, value, duration) {
        try {
            await this.setAsync(key, value, 'EX', duration);
        } catch (err) {
            console.error(`Error setting key ${key}: ${err}`);
        }
    }

    // Asynchronously delete a key from Redis
    async del(key) {
        try {
            await this.delAsync(key);
        } catch (err) {
            console.error(`Error deleting key ${key}: ${err}`);
        }
    }
}

// Export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;

