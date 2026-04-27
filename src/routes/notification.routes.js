const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, notificationController.getNotifications);
router.patch('/read', verifyToken, notificationController.markAsRead);

module.exports = router;
