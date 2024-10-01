import redisClient from './utils/redis';

(async () => {
  // Check if Redis is alive
  console.log(redisClient.isAlive());

  // Try getting a non-existing key (should return null)
  console.log(await redisClient.get('myKey'));

  // Set a key with an expiration of 5 seconds
  await redisClient.set('myKey', 12, 5);

  // Get the key again (should return 12)
  console.log(await redisClient.get('myKey'));

  // Wait for 10 seconds and check the key again (should return null since it expired)
  setTimeout(async () => {
    console.log(await redisClient.get('myKey')); // should be null after expiration
  }, 1000 * 10);
})();

