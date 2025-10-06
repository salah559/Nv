const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { PRODUCTS_FILE, ORDERS_FILE, ADMINS_FILE } = require('./config/paths');
const { readJSON, writeJSON } = require('./utils/fileManager');
const initializeAdmin = require('./utils/initAdmin');
const authenticateToken = require('./middleware/auth');

const app = express();
const PORT = 5000;

app.set('trust proxy', 1);

app.use(helmet({
    contentSecurityPolicy: false
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة بعد قليل'
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'تم تجاوز الحد المسموح من محاولات تسجيل الدخول'
});

app.use('/api/', limiter);
app.use('/api/admin/login', authLimiter);
app.use(cors());
app.use(bodyParser.json());
app.use('/public', express.static(path.resolve(__dirname, '../public')));

const adminRoutes = require('./routes/admin')(readJSON, writeJSON, ADMINS_FILE);
const productsRoutes = require('./routes/products')(readJSON, writeJSON, PRODUCTS_FILE, authenticateToken);
const ordersRoutes = require('./routes/orders')(readJSON, writeJSON, ORDERS_FILE, authenticateToken);
const ratingsRoutes = require('./routes/ratings')(readJSON, writeJSON, PRODUCTS_FILE);
const statsRoutes = require('./routes/stats')(readJSON, PRODUCTS_FILE, ORDERS_FILE, authenticateToken);

app.use('/api/admin', adminRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/stats', statsRoutes);

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin.html'));
});

app.get('/data/algeria-locations.json', (req, res) => {
    res.sendFile(path.join(__dirname, '../data/algeria-locations.json'));
});

app.get('/data/products.json', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/data/products.json'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, '0.0.0.0', async () => {
    await initializeAdmin(readJSON, writeJSON, ADMINS_FILE);
    console.log(`🚀 NovaFashion Server running on http://0.0.0.0:${PORT}`);
    console.log(`📱 Admin Panel: http://0.0.0.0:${PORT}/admin.html`);
    console.log(`🛍️  Storefront: http://0.0.0.0:${PORT}/`);
});
