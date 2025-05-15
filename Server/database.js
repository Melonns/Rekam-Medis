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
// // Ganti dengan data dari Railway (lihat bagian "Connect" di plugin MySQL)
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // ganti dengan port dari Railway
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('Koneksi gagal:', err.stack);
    return;
  }
  console.log('Tersambung ke database dengan ID ' + connection.threadId);
});

module.exports = connection;
