console.log('--- Garments ERP Server v3.0 [Activated] ---');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const warehouseRoutes = require('./routes/warehouse.routes');
const requestRoutes = require('./routes/request.routes');
const productionRoutes = require('./routes/production.routes');
const orderRoutes = require('./routes/order.routes');
const superAdminRoutes = require('./routes/superadmin.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'Garments ERP Backend API is running',
        version: '3.0',
        docs: '/api/ping'
    });
});

// Health Check
app.get('/api/ping', (req, res) => res.json({ message: 'Backend is online' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/payments', paymentRoutes);
app.post('/api/payments/:id/process-direct', (req, res) => res.json({ message: 'Direct payment route hit', id: req.params.id }));
app.use('/api/notifications', require('./routes/notification.routes'));

const PORT = process.env.PORT || 5000;

// Start server immediately so Render detects the open port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Sync DB after server is up
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced successfully');
    })
    .catch(err => {
        console.error('Unable to sync database:', err.message);
    });
