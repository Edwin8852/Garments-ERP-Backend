const sequelize = require('../config/db.config');
const User = require('./user.model');
const Product = require('./product.model');
const Warehouse = require('./warehouse.model');
const RawMaterial = require('./rawMaterial.model');
const Request = require('./request.model');
const RequestItem = require('./requestItem.model');
const PricingRule = require('./pricingRule.model');
const Production = require('./production.model');
const Order = require('./order.model');
const Notification = require('./notification.model');

// Associations
User.hasMany(Request, { foreignKey: 'userId' });
Request.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Warehouse, { foreignKey: 'productId' });
Warehouse.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(Request, { foreignKey: 'productId' });
Request.belongsTo(Product, { foreignKey: 'productId' });

Request.hasMany(RequestItem, { foreignKey: 'requestId' });
RequestItem.belongsTo(Request, { foreignKey: 'requestId' });

Product.hasMany(Production, { foreignKey: 'productId' });
Production.belongsTo(Product, { foreignKey: 'productId' });

Request.hasOne(Production, { foreignKey: 'requestId' });
Production.belongsTo(Request, { foreignKey: 'requestId' });

Request.hasOne(Order, { foreignKey: 'requestId' });
Order.belongsTo(Request, { foreignKey: 'requestId' });

const db = {
    sequelize,
    User,
    Product,
    Warehouse,
    RawMaterial,
    Request,
    RequestItem,
    PricingRule,
    Production,
    Order,
    Notification
};

module.exports = db;
