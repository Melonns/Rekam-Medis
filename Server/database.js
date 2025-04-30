// const sql = require('msnodesqlv8');

// Ini adalah connection string lokal Anda
// const connectionString = "Server=localhost\\SQLEXPRESS;Database=Rekam_Medis;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

// Ganti dengan module mysql untuk Railway
const mysql = require('mysql2');

// Buat pool koneksi MySQL menggunakan kredensial Railway
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  ssl: {
    // Biasanya railway memerlukan SSL
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (sqlQuery, callback) => {
    // Format query untuk MySQL jika diperlukan (SQL Server dan MySQL sintaksnya sedikit berbeda)
    pool.query(sqlQuery, (error, results) => {
      callback(error, results);
    });
  }
};