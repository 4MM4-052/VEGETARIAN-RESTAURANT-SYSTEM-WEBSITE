const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306
});

// Giả lập connection.query để dùng callback
const connection = {
  query: (sql, values, cb) => pool.query(sql, values, cb)
};

module.exports = { connection };