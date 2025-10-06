const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { loginValidation } = require('../middleware/validators');

const JWT_SECRET = process.env.JWT_SECRET || 'novafashion_secret_key_2025';

module.exports = (readJSON, writeJSON, ADMINS_FILE) => {
    router.post('/login', loginValidation, async (req, res) => {
        const { username, password } = req.body;
        const admins = readJSON(ADMINS_FILE, []);
        const admin = admins.find(a => a.username === username);
        
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: admin.id, username: admin.username }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        res.json({ token, username: admin.username });
    });

    return router;
};
