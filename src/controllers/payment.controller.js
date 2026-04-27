const { Request, Product } = require('../models');

// Process Standard Payment (QR or CARD)
exports.processPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { method } = req.body; // QR, CARD, CASH

        const order = await Request.findByPk(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (method === 'CASH') {
            await order.update({
                paymentMethod: 'CASH',
                paymentStatus: 'CASH_PENDING'
            });
            return res.json({ message: 'Cash payment initiated. Awaiting admin verification.', order });
        }

        // For QR/CARD - Mark as PAID immediately (Simulated)
        await order.update({
            paymentMethod: method,
            paymentStatus: 'PAID'
        });

        await require('../models').Notification.create({
            userId: order.userId,
            message: `Payment successful for order ${order.invoiceNumber}.`
        });

        res.json({ message: 'Payment successful!', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin verify Cash Payment
exports.verifyCashPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Request.findByPk(id);
        
        if (!order) return res.status(404).json({ message: 'Order not found' });
        
        await order.update({ paymentStatus: 'PAID' });

        await require('../models').Notification.create({
            userId: order.userId,
            message: `Your cash payment for order ${order.invoiceNumber} has been verified.`
        });

        res.json({ message: 'Cash payment verified successfully!', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
