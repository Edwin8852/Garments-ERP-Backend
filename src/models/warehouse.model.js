const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Warehouse = sequelize.define('Warehouse', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.VIRTUAL,
        get() {
            const qty = this.getDataValue('quantity');
            if (qty <= 0) return 'OUT_OF_STOCK';
            if (qty < 10) return 'LOW_STOCK';
            return 'IN_STOCK';
        }
    }
});

module.exports = Warehouse;
