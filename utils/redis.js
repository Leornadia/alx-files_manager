// utils/redis.js

class RedisClient {
  constructor(host = 'localhost', port = 6379) {
    this.redisClient = null;
    this.host = host;
    this.port = port;

    this.connect();
  }

  connect() {
    try {
      this.redisClient = redis.createClient(this.port, this.host);
      this.redisClient.on('error', (err) => {
        console.error(`Redis Client Error: ${err}`);
      });
    } catch (error) {
      console.error(`Failed to connect to Redis: ${error}`);
    }
  }

  isAlive() {
    return this.redisClient && this.redisClient.ping() ===pong;
  }

  async get(key) {
    return await this.redisClient.get(key);
  }

  async set(key, value, seconds) {
    await this.redisClient.set(key, value, seconds * 1000);
  }

  async del(key) {
    await this.redisClient.del(key);
  }
}

export const redisClient = new RedisClient();
