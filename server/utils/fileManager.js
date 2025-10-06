const fs = require('fs');

function readJSON(file, defaultData = []) {
    try {
        if (fs.existsSync(file)) {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        }
    } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
    }
    return defaultData;
}

function writeJSON(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(`Error writing ${file}:`, e.message);
    }
}

module.exports = { readJSON, writeJSON };
