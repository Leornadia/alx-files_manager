import express from 'express';
import UsersController from './controllers/UsersController';
import { userQueue } from './worker'; // Import the worker

const app = express();
app.use(express.json());

// Users route
app.post('/users', UsersController.postNew);

// Initialize the worker process
userQueue.on('completed', (job) => {
  console.log(`Job with id ${job.id} has been completed`);
});

userQueue.on('failed', (job, err) => {
  console.log(`Job with id ${job.id} has failed with error ${err.message}`);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

