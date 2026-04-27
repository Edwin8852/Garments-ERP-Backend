const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');
const { verifyToken, authorize } = require('../middleware/auth.middleware');

router.get('/', verifyToken, requestController.getRequests);
router.post('/', verifyToken, requestController.createRequest);
router.patch('/:id/process', verifyToken, authorize(['SUPER_ADMIN', 'ADMIN']), requestController.processRequest);

module.exports = router;
