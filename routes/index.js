import express from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController'; // Import UsersController

const router = express.Router(); // Create a router instance

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Add user creation route
router.post('/users', UsersController.postNew);  // POST /users

// Add authentication routes
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

export default router; // Export the router instance

