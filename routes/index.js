import express from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';
import FilesController from '../controllers/FilesController'; // Make sure this path is correct

const router = express.Router();

// App-related routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Auth-related routes
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);

// User-related routes
router.get('/users/me', UsersController.getMe);

// File-related routes
router.post('/files', FilesController.postUpload); // POST route should correctly reference postUpload
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);

export default router;

