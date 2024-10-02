import { expect } from 'chai';
import redisClient from '../utils/redis';

describe('redisClient', () => {
  it('should connect to Redis server', async () => {
    const isConnected = await redisClient.isAlive();
    expect(isConnected).to.be.true;
  });

  it('should set and get a value from Redis', async () => {
    await redisClient.set('test_key', 'test_value', 10);
    const value = await redisClient.get('test_key');
    expect(value).to.equal('test_value');
  });

  it('should delete a key from Redis', async () => {
    await redisClient.set('test_key', 'test_value', 10);
    await redisClient.del('test_key');
    const value = await redisClient.get('test_key');
    expect(value).to.be.null;
  });
});

