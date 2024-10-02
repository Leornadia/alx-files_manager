import redisClient from '../utils/redis'; // Import the Redis utility
import dbClient from '../utils/db';       // Import the MongoDB utility

class AppController {
  // Handle GET /status
  static getStatus(req, res) {
    const status = {
      redis: redisClient.isAlive(), // Check if Redis is alive
      db: dbClient.isAlive()        // Check if MongoDB is alive
    };
    return res.status(200).json(status);
  }

  // Handle GET /stats
  static async getStats(req, res) {
    const stats = {
      users: await dbClient.nbUsers(), // Get the number of users from MongoDB
      files: await dbClient.nbFiles()  // Get the number of files from MongoDB
    };
    return res.status(200).json(stats);
  }
}

export default AppController;

