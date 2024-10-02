import express from 'express';
import routes from './routes/index';  // Import the routes

// Initialize the Express app
const app = express();

// Set the port to the environment variable PORT or 5000
const PORT = process.env.PORT || 5000;

// Use the routes from routes/index.js
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

