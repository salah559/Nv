const express = require('express');
const router = express.Router();

module.exports = (readJSON, PRODUCTS_FILE, ORDERS_FILE, authenticateToken) => {
    router.get('/', authenticateToken, (req, res) => {
        const products = readJSON(PRODUCTS_FILE, []);
        const orders = readJSON(ORDERS_FILE, []);
        
        const totalProducts = products.length;
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
        
        const ordersByStatus = {
            pending: orders.filter(o => o.status === 'pending').length,
            confirmed: orders.filter(o => o.status === 'confirmed').length,
            delivered: orders.filter(o => o.status === 'delivered').length
        };
        
        const recentOrders = orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        
        const topProducts = products
            .map(p => ({
                ...p,
                orderCount: orders.filter(o => 
                    o.items.some(item => item.id === p.id)
                ).length
            }))
            .sort((a, b) => b.orderCount - a.orderCount)
            .slice(0, 5);
        
        res.json({
            totalProducts,
            totalOrders,
            totalRevenue,
            ordersByStatus,
            recentOrders,
            topProducts
        });
    });
    
    return router;
};
