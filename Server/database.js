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

// Ganti dengan data dari Railway (lihat bagian "Connect" di plugin MySQL)
const connection = mysql.createConnection({
  host: 'mysql.railway.internal',
  port: 3306, // ganti dengan port dari Railway
  user: 'root',
  password: 'root',
  database: 'yrXJqyYfHrMGsdrpREljVgugatonNuBB',
});

connection.connect((err) => {
  if (err) {
    console.error('Koneksi gagal:', err.stack);
    return;
  }
  console.log('Tersambung ke database dengan ID ' + connection.threadId);
});

module.exports = connection;
