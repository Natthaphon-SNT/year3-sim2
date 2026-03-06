const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'university01',
    password: '0000',
    port: 5432,
});

pool.on('connect', client => {
    client.query("Set search_path to public");
});

module.exports = pool;