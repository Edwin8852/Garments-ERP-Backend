const { Product } = require('./src/models');

const products = [
    { name: 'Industrial Safety Vest', category: 'Workwear', price: 450.00 },
    { name: 'Flame Resistant Coverall', category: 'Workwear', price: 2850.00 },
    { name: 'Heavy Duty Denim Jeans', category: 'Workwear', price: 1200.00 },
    { name: 'Anti-Static Lab Coat', category: 'Professional', price: 950.00 },
    { name: 'Thermal Insulated Jacket', category: 'Outerwear', price: 3200.00 },
    { name: 'High-Vis Rain Coat', category: 'Outerwear', price: 750.00 },
    { name: 'Reinforced Cargo Pants', category: 'Workwear', price: 1100.00 },
    { name: 'Breathable Office Polo', category: 'Casual', price: 550.00 },
    { name: 'Formal Twill Shirt', category: 'Formal', price: 850.00 },
    { name: 'Steel-Toe Protective Socks', category: 'Accessories', price: 150.00 }
];

async function seed() {
    try {
        for (const p of products) {
            const [product, created] = await Product.findOrCreate({
                where: { name: p.name },
                defaults: p
            });
            if (created) {
                console.log(`Added: ${p.name}`);
            } else {
                console.log(`Skipped: ${p.name} (exists)`);
            }
        }
        console.log('Seeding completed!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
