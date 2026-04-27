const { User, Product, RawMaterial, Warehouse, sequelize } = require('./src/models');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        console.log('--- Cleaning Legacy Enums ---');
        await sequelize.query('DROP TABLE IF EXISTS "Users" CASCADE;');
        await sequelize.query('DROP TYPE IF EXISTS "enum_Users_role" CASCADE;');
        
        await sequelize.sync({ force: true });
        console.log('Database synced for seeding...');

        // Create Roles
        const hashedAdminPass = await bcrypt.hash('admin123', 10);
        const hashedEdwinPass = await bcrypt.hash('edwin@321', 10);
        const hashedUserPass = await bcrypt.hash('user123', 10);

        await User.create({
            name: 'Main Super Admin',
            email: 'admin@erp.com',
            password: hashedAdminPass,
            role: 'SUPER_ADMIN'
        });

        await User.create({
            name: 'Edwin Admin',
            email: 'edwin@erp.com',
            password: hashedEdwinPass,
            role: 'ADMIN'
        });

        await User.create({
            name: 'Annai Insulation',
            email: 'user@erp.com',
            password: hashedUserPass,
            role: 'USER'
        });

        // Create Products
        const silkShirt = await Product.create({ name: 'Pure Silk Shirt', category: 'Formal', price: 2499.00 });
        const cottonPants = await Product.create({ name: 'Chino Cotton Pants', category: 'Casual', price: 1850.50 });
        const woolSuit = await Product.create({ name: 'Merino Wool Suit', category: 'Formal', price: 9450.00 });

        // Create Raw Materials
        await RawMaterial.create({ name: 'Cloth', quantity: 1500 });
        await RawMaterial.create({ name: 'Buttons', quantity: 5000 });
        await RawMaterial.create({ name: 'Thread', quantity: 1000 });

        // Seed initial Warehouse stock
        await Warehouse.create({ productId: silkShirt.id, size: 'M', quantity: 50 });
        await Warehouse.create({ productId: silkShirt.id, size: 'L', quantity: 5 }); // Low stock
        await Warehouse.create({ productId: cottonPants.id, size: '32', quantity: 100 });

        console.log('Seed completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
};

seed();
