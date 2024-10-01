// server.js
import express from 'express';
import router from './routes/index'; // Import the router, not just the routes module


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Use the router correctly:
app.use('/', router); // Or app.use('/api', router) if you want to prefix your routes

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
