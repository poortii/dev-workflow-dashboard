require('dotenv').config(); 

const fs = require('fs').promises;
const path = require('path');
const { query } = require('./db');

async function runMigrations() {
    try {
        console.log('Starting migrations...');
        const sql = await fs.readFile(path.join(__dirname, 'migrations', '01_create_tables.sql'), 'utf-8');

        await query(sql);

        console.log('Migrations completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error running migrations:', error);
        process.exit(1);
    }
}

runMigrations();