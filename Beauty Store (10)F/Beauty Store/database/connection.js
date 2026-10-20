const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'beautysupplystore',
    password: process.env.DB_PASSWORD || '@mel01',
    port: process.env.DB_PORT || 5432,
});

// Test connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};