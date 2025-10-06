const express = require('express');
const router = express.Router();
const { productValidation } = require('../middleware/validators');

module.exports = (readJSON, writeJSON, PRODUCTS_FILE, authenticateToken) => {
    router.get('/', (req, res) => {
        const products = readJSON(PRODUCTS_FILE, []);
        res.json(products);
    });

    router.post('/', authenticateToken, productValidation, (req, res) => {
        const products = readJSON(PRODUCTS_FILE, []);
        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            ...req.body,
            createdAt: new Date().toISOString()
        };
        products.push(newProduct);
        writeJSON(PRODUCTS_FILE, products);
        res.json(newProduct);
    });

    router.put('/:id', authenticateToken, productValidation, (req, res) => {
        const products = readJSON(PRODUCTS_FILE, []);
        const index = products.findIndex(p => p.id === parseInt(req.params.id));
        
        if (index === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        products[index] = { 
            ...products[index], 
            ...req.body, 
            updatedAt: new Date().toISOString() 
        };
        
        writeJSON(PRODUCTS_FILE, products);
        res.json(products[index]);
    });

    router.delete('/:id', authenticateToken, (req, res) => {
        let products = readJSON(PRODUCTS_FILE, []);
        products = products.filter(p => p.id !== parseInt(req.params.id));
        writeJSON(PRODUCTS_FILE, products);
        res.json({ success: true });
    });

    return router;
};
