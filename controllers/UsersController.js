import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import { hashPassword } from '../utils/auth';
import { userQueue } from '../worker';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if email already exists
    const userExists = await dbClient.usersCollection.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password and create a new user
    const hashedPassword = hashPassword(password);
    const result = await dbClient.usersCollection.insertOne({
      email,
      password: hashedPassword,
    });

    const userId = result.insertedId;

    // Add job to Bull queue for sending welcome email
    await userQueue.add({ userId });

    return res.status(201).json({ id: userId, email });
  }
}

export default UsersController;

