const bcrypt = require('bcryptjs');

async function initializeAdmin(readJSON, writeJSON, ADMINS_FILE) {
    const admins = readJSON(ADMINS_FILE, []);
    
    if (admins.length === 0) {
        const hashedPassword = await bcrypt.hash('salaho55', 10);
        admins.push({
            id: 1,
            username: 'salah55',
            password: hashedPassword,
            email: 'salah@novafashion.dz'
        });
        writeJSON(ADMINS_FILE, admins);
        console.log('✅ Default admin created: username=salah55, password=salaho55');
    }
}

module.exports = initializeAdmin;
