const { Production, Request, Warehouse, Product, Order, RawMaterial } = require('../models');

exports.getProductionOrders = async (req, res) => {
    try {
        const orders = await Production.findAll({ include: [Product, Request] });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProductionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'In Progress', 'Completed'
        const production = await Production.findByPk(id, { include: [Product, Request] });

        if (!production) return res.status(404).json({ message: 'Production order not found' });

        if (status === 'In Progress') {
            // Deduct raw materials (example logic: 1 product = 1 cloth, 5 buttons, 1 thread)
            // Simplified: just check if 'Cloth' exists
            const cloth = await RawMaterial.findOne({ where: { name: 'Cloth' } });
            if (!cloth || cloth.quantity < production.quantity) {
                return res.status(400).json({ message: 'Insufficient Raw Materials (Cloth)' });
            }
            cloth.quantity -= production.quantity;
            await cloth.save();
        }

        production.status = status;
        await production.save();

        if (status === 'Completed') {
            // 1. Refill Warehouse (Logistically it enters warehouse first)
            let stock = await Warehouse.findOne({ where: { productId: production.productId, size: production.size } });
            if (stock) {
                stock.quantity += production.quantity;
                await stock.save();
            } else {
                stock = await Warehouse.create({
                    productId: production.productId,
                    size: production.size,
                    quantity: production.quantity
                });
            }

            // 2. Dispatch immediately for the Request that triggered it (Virtual deduction)
            stock.quantity -= production.quantity;
            await stock.save();

            // 3. Update Request Status if all batches are finished
            const otherBatches = await Production.count({ 
                where: { 
                    requestId: production.requestId, 
                    status: { [require('sequelize').Op.ne]: 'Completed' } 
                } 
            });

            if (otherBatches === 0) {
                const request = await Request.findByPk(production.requestId);
                request.status = 'Approved';
                await request.save();
            }
        }

        res.json(production);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
