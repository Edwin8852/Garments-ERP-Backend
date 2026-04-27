const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, authorize } = require('../middleware/auth.middleware');

router.get('/', verifyToken, productController.getProducts);
router.get('/pricing-rules', verifyToken, productController.getPricingRules);
router.post('/pricing-rules', verifyToken, authorize(['SUPER_ADMIN', 'ADMIN']), productController.updatePricingRule);
router.post('/', verifyToken, authorize(['SUPER_ADMIN', 'ADMIN']), productController.createProduct);
router.put('/:id', verifyToken, authorize(['SUPER_ADMIN', 'ADMIN']), productController.updateProduct);
router.delete('/:id', verifyToken, authorize(['SUPER_ADMIN', 'ADMIN']), productController.deleteProduct);

module.exports = router;
