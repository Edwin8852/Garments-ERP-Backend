const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Production = sequelize.define('Production', {
    requestId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
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
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
        defaultValue: 'Pending'
    }
});

module.exports = Production;
