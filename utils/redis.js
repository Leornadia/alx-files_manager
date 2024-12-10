import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.client.on('error', (err) => {
      console.error(`Redis Error: ${err}`);
    });

    this.client.on('connect', () => {
      console.log('Redis connected');
    });

    this.client.on('ready', () => {
      console.log('Redis ready!');
    });

    this.client.on('reconnecting', () => {
      console.log('Redis reconnecting');
    });

    this.isReady = false;

    this.client.connect().then(() => {
      this.isReady = true;
    }).catch((err) => {
      console.error(`Failed to connect to Redis: ${err}`);
    });
  }

  isAlive() {
    return this.isReady;
  }

  async get(key) {
    if (!this.isReady) {
      throw new Error('Redis client is not ready');
    }
    return this.client.get(key);
  }

  async set(key, value, duration) {
    if (!this.isReady) {
      throw new Error('Redis client is not ready');
    }
    return this.client.setEx(key, duration, value);
  }

  async del(key) {
    if (!this.isReady) {
      throw new Error('Redis client is not ready');
    }
    return this.client.del(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
