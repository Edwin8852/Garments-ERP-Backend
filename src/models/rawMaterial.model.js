const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const RawMaterial = sequelize.define('RawMaterial', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = RawMaterial;
