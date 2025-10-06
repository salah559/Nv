const express = require('express');
const router = express.Router();
const { orderValidation, orderStatusValidation } = require('../middleware/validators');

module.exports = (readJSON, writeJSON, ORDERS_FILE, authenticateToken) => {
    router.get('/', authenticateToken, (req, res) => {
        const orders = readJSON(ORDERS_FILE, []);
        res.json(orders);
    });

    router.post('/', orderValidation, (req, res) => {
        const orders = readJSON(ORDERS_FILE, []);
        const newOrder = {
            id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
            ...req.body,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        orders.push(newOrder);
        writeJSON(ORDERS_FILE, orders);
        res.json(newOrder);
    });

    router.put('/:id', authenticateToken, orderStatusValidation, (req, res) => {
        const orders = readJSON(ORDERS_FILE, []);
        const index = orders.findIndex(o => o.id === parseInt(req.params.id));
        
        if (index === -1) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        orders[index] = { 
            ...orders[index], 
            ...req.body, 
            updatedAt: new Date().toISOString() 
        };
        
        writeJSON(ORDERS_FILE, orders);
        res.json(orders[index]);
    });

    return router;
};
