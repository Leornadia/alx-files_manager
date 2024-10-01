import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  // POST /users
  static async postNew(req, res) {
    try {
      const { email, password } = req.body;

      // Check if email is provided
      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }

      // Validate email format (basic regex for example purposes)
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Check if password is provided
      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      // Check if the user already exists
      const existingUser = await dbClient.db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password using SHA1
      const hashedPassword = sha1(password);

      // Insert the new user into the database
      const result = await dbClient.db.collection('users').insertOne({
        email,
        password: hashedPassword,
      });

      // Return the new user with id and email only
      return res.status(201).json({
        id: result.insertedId,
        email,
      });
    } catch (error) {
      console.error('Error creating new user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // GET /users/me
  static async getMe(req, res) {
    try {
      // Get the token from the headers
      const token = req.headers['x-token'];

      // Check if token exists in Redis
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Fetch user from the database using userId from Redis
      const user = await dbClient.db.collection('users').findOne({ _id: new dbClient.ObjectId(userId) });
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Return the user data (only email and id)
      return res.status(200).json({
        id: user._id,
        email: user.email,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;

