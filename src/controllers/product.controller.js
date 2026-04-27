const { Product, PricingRule } = require('../models');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPricingRules = async (req, res) => {
    try {
        let rules = await PricingRule.findAll();
        if (rules.length === 0) {
            // Seed defaults if empty
            const defaults = [
                { size: 'S', adjustment: -15 },
                { size: 'M', adjustment: 0 },
                { size: 'L', adjustment: 0 },
                { size: 'XL', adjustment: 10 },
                { size: '2XL', adjustment: 20 }
            ];
            await PricingRule.bulkCreate(defaults);
            rules = await PricingRule.findAll();
        }
        res.json(rules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePricingRule = async (req, res) => {
    try {
        const { size, adjustment } = req.body;
        await PricingRule.upsert({ size, adjustment });
        res.json({ message: 'Pricing rule updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.update(req.body, { where: { id } });
        res.json({ message: 'Product updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.destroy({ where: { id } });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
