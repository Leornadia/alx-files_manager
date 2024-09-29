import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import mongoose from 'mongoose';
import redis from 'redis';


const redisClient = redis.createClient(); //redis connection


// Define your User model (adapt to your schema)
const User = mongoose.model('User', { email: String, password: String });

const AuthController = {
    async getConnect(req, res) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const base64Credentials = authHeader.substring('Basic '.length);
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        const user = await User.findOne({ email });
        if (!user || user.password !== crypto.createHash('sha1').update(password).digest('hex')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = uuidv4();
        const key = `auth_${token}`;
        redisClient.set(key, user._id, 'EX', 24 * 60 * 60); //Store for 24 hours

        res.json({ token });
    },
    async getDisconnect(req, res) {
        const token = req.headers['x-token'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const key = `auth_${token}`;
        redisClient.del(key);
        res.status(204).send(); //No content
    },
    async authorize(req, res, next) {
        const token = req.headers['x-token'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const key = `auth_${token}`;
        redisClient.get(key, async (err, userId) => {
            if (err || !userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            req.userId = userId;
            next();
        });
    },
};

export default AuthController;
