if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
});

/*const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'Subscrivery',
  user: 'postgres',
  password: 'Fujisao2706'
});*/

module.exports = pool;