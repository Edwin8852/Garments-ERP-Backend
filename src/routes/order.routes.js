const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, orderController.getInvoices);
router.get('/:id', verifyToken, orderController.getInvoice);

module.exports = router;
