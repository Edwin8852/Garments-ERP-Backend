const { sequelize } = require('./src/models');
const { execSync } = require('child_process');

async function cleanAndSeed() {
    try {
        console.log('--- Reseting Enterprise Database ---');
        // We use force: true inside seed.js already, but let's make sure it runs clean
        require('./seed.js');
    } catch (e) {
        console.error(e);
    }
}

cleanAndSeed();
