import express from 'express';
import routes from './routes/index.js';
import Redis from 'ioredis';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 5000;
const redis = new Redis();
let redisConnected = false;
let dbConnected = false;

// MongoDB connection (replace with your connection string)
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    dbConnected = true;
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });


async function connectToRedis() {
  if (redisConnected) return;
  try {
    await redis.connect();
    redisConnected = true;
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    process.exit(1);
  }
}

connectToRedis()

app.use(express.json()); //for parsing JSON
app.use('/', routes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
