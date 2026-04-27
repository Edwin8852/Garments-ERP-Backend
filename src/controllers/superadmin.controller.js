const { User, Order, Warehouse, Production, Product, sequelize } = require('../models');

exports.getGlobalStats = async (req, res) => {
    try {
        const [totalUsers, totalOrders, warehouseSummary, productionBatches, financialData, allUsers] = await Promise.all([
            User.count(),
            Order.count(),
            Warehouse.findAll({ include: Product }),
            Production.findAll({ include: [Product] }),
            Order.findAll(),
            User.findAll({ attributes: ['id', 'name', 'email', 'role', 'createdAt'] })
        ]);

        const totalRevenue = financialData.reduce((acc, curr) => acc + parseFloat(curr.totalAmount), 0);
        const totalGst = financialData.reduce((acc, curr) => acc + parseFloat(curr.gst), 0);
        const grandTotal = totalRevenue + totalGst;

        res.json({
            stats: {
                totalUsers,
                totalOrders,
                totalRevenue,
                totalGst,
                grandTotal,
                warehouseItemCount: warehouseSummary.length,
                activeProduction: productionBatches.filter(b => b.status !== 'Completed').length
            },
            warehouseStock: warehouseSummary,
            production: productionBatches,
            users: allUsers,
            revenueHistory: financialData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        user.role = role;
        await user.save();
        res.json({ message: 'User role updated', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.id == id) return res.status(400).json({ message: 'Cannot delete yourself' });
        
        await User.destroy({ where: { id } });
        res.json({ message: 'User removed from system' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
