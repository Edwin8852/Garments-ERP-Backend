const { Order, Request, Product, User } = require('../models');

exports.getInvoices = async (req, res) => {
    try {
        const query = req.user.role === 'User' ? { '$Request.userId$': req.user.id } : {};
        const invoices = await Order.findAll({ 
            include: [{
                model: Request,
                include: [Product, User]
            }]
        });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Order.findByPk(id, {
            include: [{
                model: Request,
                include: [Product, User]
            }]
        });
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
