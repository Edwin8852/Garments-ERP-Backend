const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { verifyToken, authorize } = require('../middleware/auth.middleware');

// User payment processing
router.post('/:id/process', verifyToken, paymentController.processPayment);

// Admin cash verification
router.patch('/:id/verify-cash', verifyToken, authorize(['SUPER_ADMIN', 'ADMIN']), paymentController.verifyCashPayment);

module.exports = router;
