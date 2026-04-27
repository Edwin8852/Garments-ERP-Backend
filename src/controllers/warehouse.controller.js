const { Warehouse, RawMaterial, Product } = require('../models');

// Stock Management
exports.getWarehouseStock = async (req, res) => {
    try {
        const stock = await Warehouse.findAll({ include: Product });
        res.json(stock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStock = async (req, res) => {
    try {
        const { productId, size, quantity, operation } = req.body; 
        const qty = parseInt(quantity) || 0;
        let stock = await Warehouse.findOne({ where: { productId, size }, include: Product });

        if (!stock && operation === 'IN') {
            stock = await Warehouse.create({ productId, size, quantity: qty });
        } else if (stock) {
            const newQty = operation === 'IN' ? stock.quantity + qty : stock.quantity - qty;
            if (newQty < 0) return res.status(400).json({ message: 'Insufficient stock' });
            stock.quantity = newQty;
            await stock.save();

            // Trigger notification if stock drops low
            if (stock.quantity < 10) {
                const admins = await require('../models').User.findAll({ 
                    where: { role: ['ADMIN', 'SUPER_ADMIN'] } 
                });
                for (const admin of admins) {
                    await require('../models').Notification.create({
                        userId: admin.id,
                        message: `ALERT: ${stock.Product?.name || 'Item'} (${stock.size}) is now LOW STOCK (${stock.quantity} units left).`
                    });
                }
            }
        } else {
            return res.status(404).json({ message: 'Stock profile not found' });
        }

        res.json(stock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.refillStock = async (req, res) => {
    try {
        const { id } = req.params; 
        const amount = parseInt(req.body?.amount);
        
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Invalid quantity input' });
        }

        const stock = await Warehouse.findByPk(id, { include: Product });
        
        if (!stock) {
            console.error(`Refill failed: Warehouse record with ID ${id} not found`);
            return res.status(404).json({ message: 'Stock record not found' });
        }
        
        stock.quantity += amount;
        await stock.save();

        console.log(`Refill Success: Added ${amount} units to ${stock.Product?.name || 'ID ' + id}`);

        res.json({ 
            success: true,
            message: 'Stock refilled successfully', 
            stock 
        });
    } catch (error) {
        console.error('SERVER ERROR in refillStock:', error);
        res.status(500).json({ message: 'Internal Server Error during refill' });
    }
};

// Raw Materials
exports.getRawMaterials = async (req, res) => {
    try {
        const materials = await RawMaterial.findAll();
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRawMaterial = async (req, res) => {
    try {
        const { name, quantity, operation } = req.body;
        let material = await RawMaterial.findOne({ where: { name } });

        if (!material && operation === 'IN') {
            material = await RawMaterial.create({ name, quantity });
        } else if (material) {
            material.quantity = operation === 'IN' ? material.quantity + quantity : material.quantity - quantity;
            await material.save();
        }
        res.json(material);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
