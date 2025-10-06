const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '../../data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');

module.exports = {
    DATA_DIR,
    PRODUCTS_FILE,
    ORDERS_FILE,
    ADMINS_FILE
};
