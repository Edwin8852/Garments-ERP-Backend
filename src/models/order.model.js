const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Order = sequelize.define('Order', {
    requestId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    gst: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    finalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Generated'
    }
});

module.exports = Order;
