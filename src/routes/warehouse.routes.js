const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouse.controller');
const { verifyToken, authorize } = require('../middleware/auth.middleware');

router.get('/stock', verifyToken, warehouseController.getWarehouseStock);
router.post('/stock', verifyToken, authorize(['SUPER_ADMIN', 'ADMIN']), warehouseController.updateStock);
router.patch('/refill/:id', verifyToken, authorize(['SUPER_ADMIN', 'ADMIN']), warehouseController.refillStock);
router.get('/raw-materials', verifyToken, warehouseController.getRawMaterials);
router.post('/raw-materials', verifyToken, authorize(['SUPER_ADMIN', 'ADMIN']), warehouseController.updateRawMaterial);

module.exports = router;
