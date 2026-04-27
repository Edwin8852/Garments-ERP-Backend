const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const PricingRule = sequelize.define('PricingRule', {
    size: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    adjustment: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        comment: 'Positive for extra, negative for discount'
    }
});

module.exports = PricingRule;
