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
const url = require('url');

// Parse DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL);

const connection = mysql.createConnection({
  host: dbUrl.hostname,
  port: dbUrl.port,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace('/', ''),
});

connection.connect((err) => {
  if (err) {
    console.error('Koneksi gagal:', err.stack);
    return;
  }
  console.log('Tersambung ke database dengan ID ' + connection.threadId);
});

module.exports = connection;
