const express = require('express');
const router = express.Router();
const productionController = require('../controllers/production.controller');
const { verifyToken, authorize } = require('../middleware/auth.middleware');

router.get('/', verifyToken, authorize(['SUPER_ADMIN', 'ADMIN']), productionController.getProductionOrders);
router.patch('/:id/status', verifyToken, authorize(['SUPER_ADMIN', 'ADMIN']), productionController.updateProductionStatus);

module.exports = router;
