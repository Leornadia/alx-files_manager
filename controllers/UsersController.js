const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
const { ObjectId } = require('mongodb');
const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');

// User authentication controller
class UsersController {
  static async connect(req, res) {
    const auth = req.header('Authorization');
    if (!auth) return res.status(401).json({ error: 'Unauthorized' });

    const encodedCredentials = auth.split(' ')[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
    const [email, password] = decodedCredentials.split(':');

    const hashedPassword = sha1(password);
    const user = await dbClient.collection('users').findOne({ email, password: hashedPassword });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 3600);
    return res.json({ token });
  }

  static async getMe(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await dbClient.collection('users').findOne({ _id: ObjectId(userId) });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    return res.json({ id: user._id, email: user.email });
  }
}

module.exports = UsersController;

