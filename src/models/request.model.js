const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Request = sequelize.define('Request', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    urgency: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        defaultValue: 'Medium'
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'InProduction', 'Completed'),
        defaultValue: 'Pending'
    },
    paymentStatus: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'CASH_PENDING'),
        defaultValue: 'PENDING'
    },
    paymentMethod: {
        type: DataTypes.ENUM('QR', 'CARD', 'CASH', 'NONE'),
        defaultValue: 'NONE'
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    gstAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    invoiceNumber: {
        type: DataTypes.STRING,
        unique: true
    }
});

module.exports = Request;
