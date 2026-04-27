const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const RequestItem = sequelize.define('RequestItem', {
    requestId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pricePerUnit: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        defaultValue: 'Standard'
    },
    material: {
        type: DataTypes.STRING,
        defaultValue: 'Cotton'
    }
});

module.exports = RequestItem;
