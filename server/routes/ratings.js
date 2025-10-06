const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const ratingValidation = [
    body('productId').isInt({ min: 1 }).withMessage('معرف المنتج غير صحيح'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('التقييم يجب أن يكون بين 1 و 5'),
    body('review').optional().trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = (readJSON, writeJSON, PRODUCTS_FILE) => {
    router.post('/', ratingValidation, (req, res) => {
        const { productId, rating, review } = req.body;
        const products = readJSON(PRODUCTS_FILE, []);
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return res.status(404).json({ error: 'المنتج غير موجود' });
        }
        
        if (!products[productIndex].ratings) {
            products[productIndex].ratings = [];
        }
        
        if (!products[productIndex].averageRating) {
            products[productIndex].averageRating = 0;
            products[productIndex].totalRatings = 0;
        }
        
        products[productIndex].ratings.push({
            rating,
            review: review || '',
            createdAt: new Date().toISOString()
        });
        
        const allRatings = products[productIndex].ratings.map(r => r.rating);
        const average = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
        products[productIndex].averageRating = Math.round(average * 10) / 10;
        products[productIndex].totalRatings = allRatings.length;
        
        writeJSON(PRODUCTS_FILE, products);
        res.json(products[productIndex]);
    });
    
    return router;
};
