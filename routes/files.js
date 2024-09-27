const express = require('express');
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/upload', authMiddleware, fileController.uploadFile);
router.get('/', authMiddleware, fileController.listFiles);
router.patch('/:id/permission', authMiddleware, fileController.updateFilePermission);

module.exports = router;

