const { Request, RequestItem, PricingRule, Warehouse, Production, Product, Order, User } = require('../models');

exports.createRequest = async (req, res) => {
    try {
        const { productId, items, urgency = 'Medium', note = '' } = req.body; 
        const product = await Product.findByPk(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const rules = await PricingRule.findAll();
        const ruleMap = rules.reduce((acc, r) => ({ ...acc, [r.size]: r.adjustment }), {
            'S': -15, 'M': 0, 'L': 0, 'XL': 10, 'XXL': 20, 
            '32': 5, '34': 5, '36': 10, '38': 15, '40': 20
        });

        let totalAmount = 0;
        
        const request = await Request.create({
            userId: req.user.id,
            productId,
            urgency,
            note,
            status: 'Pending',
            invoiceNumber: `INV-${Date.now()}`
        });

        const requestItems = [];
        for (const item of items) {
            const adjustment = ruleMap[item.size] || 0;
            const pricePerUnit = product.price + adjustment;
            const totalPrice = pricePerUnit * item.quantity;
            totalAmount += totalPrice;

            const newItem = await RequestItem.create({
                requestId: request.id,
                size: item.size,
                quantity: item.quantity,
                color: item.color || 'Standard',
                material: item.material || 'Cotton',
                pricePerUnit,
                totalPrice
            });
            requestItems.push(newItem);
        }

        const gstAmount = totalAmount * 0.18;
        request.totalAmount = totalAmount;
        request.gstAmount = gstAmount;
        await request.save();

        // Auto-generate Order (Invoice)
        await Order.create({
            requestId: request.id,
            totalAmount,
            gst: gstAmount,
            finalAmount: totalAmount + gstAmount,
            status: 'Generated'
        });

        res.status(201).json({ request, items: requestItems });

        // Trigger Notifications
        // 1. Notify the User
        await require('../models').Notification.create({
            userId: req.user.id,
            message: `Order ${request.invoiceNumber} placed successfully.`
        });

        // 2. Notify Admins
        const admins = await require('../models').User.findAll({ 
            where: { role: ['ADMIN', 'SUPER_ADMIN'] } 
        });
        for (const admin of admins) {
            await require('../models').Notification.create({
                userId: admin.id,
                message: `URGENT: New Order ${request.invoiceNumber} placed by User #${req.user.id}.`
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.getRequests = async (req, res) => {
    try {
        const whereClause = req.user.role === 'USER' ? { userId: req.user.id } : {};
        const requests = await Request.findAll({ 
            where: whereClause,
            include: [Product, User, RequestItem] 
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.processRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Approved', 'Rejected'
        const request = await Request.findByPk(id, { include: [Product, RequestItem] });

        if (!request) return res.status(404).json({ message: 'Request not found' });

        if (status === 'Approved') {
            // Requirement 9: Only PAID orders can go to warehouse/delivery pipeline
            if (request.paymentStatus !== 'PAID') {
                return res.status(400).json({ message: 'Cannot process order. Payment is not confirmed.' });
            }

            let allAvailable = true;
            let productionItems = [];

            // Check stock for each item
            for (const item of request.RequestItems) {
                const stock = await Warehouse.findOne({ where: { productId: request.productId, size: item.size } });
                const availableQty = stock ? stock.quantity : 0;

                if (availableQty < item.quantity) {
                    allAvailable = false;
                    productionItems.push({
                        size: item.size,
                        quantity: item.quantity - availableQty,
                        available: availableQty,
                        stock
                    });
                }
            }

            if (allAvailable) {
                // Deduct all stock
                for (const item of request.RequestItems) {
                    const stock = await Warehouse.findOne({ where: { productId: request.productId, size: item.size } });
                    stock.quantity -= item.quantity;
                    await stock.save();
                }
                request.status = 'Approved';
                await request.save();
                return res.json({ message: 'Request fully approved. All sizes in stock.', request });
            } else {
                // Partial stock or no stock logic
                // For simplicity, we process what we have and send rest to Production
                for (const item of request.RequestItems) {
                    const stock = await Warehouse.findOne({ where: { productId: request.productId, size: item.size } });
                    const availableQty = stock ? stock.quantity : 0;
                    
                    if (availableQty > 0) {
                        const amountToDeduct = Math.min(availableQty, item.quantity);
                        if (stock) {
                            stock.quantity -= amountToDeduct;
                            await stock.save();

                            if (stock.quantity < 10) {
                                const admins = await require('../models').User.findAll({ 
                                    where: { role: ['ADMIN', 'SUPER_ADMIN'] } 
                                });
                                for (const admin of admins) {
                                    await require('../models').Notification.create({
                                        userId: admin.id,
                                        message: `CRITICAL: ${request.Product?.name || 'Item'} (${stock.size}) is LOW STOCK (${stock.quantity} left).`
                                    });
                                }
                            }
                        }
                    }

                    const productionQty = item.quantity - Math.min(availableQty, item.quantity);
                    if (productionQty > 0) {
                        await Production.create({
                            requestId: request.id,
                            productId: request.productId,
                            size: item.size,
                            quantity: productionQty,
                            status: 'Pending'
                        });
                    }
                }

                request.status = 'InProduction';
                await request.save();

                return res.json({ 
                    message: `Some items sent to Production. Stock deducted for available quantity.`,
                    request 
                });
            }
        } else {
            request.status = status;
            await request.save();
            
            await require('../models').Notification.create({
                userId: request.userId,
                message: `Order ${request.invoiceNumber} status updated to: ${status}.`
            });
            
            res.json({ message: `Request ${status}`, request });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
