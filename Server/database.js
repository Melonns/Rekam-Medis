// const sql = require('msnodesqlv8');

// // Connection string untuk SQL Server lokal dengan Trusted Connection
// const connectionString = "Driver={ODBC Driver 17 for SQL Server};Server=localhost\\SQLEXPRESS;Database=Rekam_Medis;Trusted_Connection=Yes;";

// module.exports = {
//   query: (sqlQuery, callback) => {
//     sql.query(connectionString, sqlQuery, (err, rows) => {
//       if (err) {
//         console.error("Query gagal:", err);
//         return callback(err, null);
//       }
//       callback(null, rows);
//     });
//   }
// };

const mysql = require('mysql2');
require('dotenv').config();
<<<<<<< Updated upstream
// // Ganti dengan data dari Railway (lihat bagian "Connect" di plugin MySQL)
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // ganti dengan port dari Railway
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
=======

// Parse DATABASE_URL dari .env
const dbUrl = new URL(process.env.DATABASE_URL);

// Gunakan pool, bukan single connection
const pool = mysql.createPool({
  host: dbUrl.hostname,
  port: dbUrl.port,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace('/', ''),
  waitForConnections: true,
  connectionLimit: 10,       // jumlah maksimal koneksi bersamaan
  queueLimit: 0              // unlimited queue
>>>>>>> Stashed changes
});

module.exports = pool;
