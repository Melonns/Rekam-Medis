// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',           // default user di XAMPP
  password: '',           // default password kosong
  database: 'rekam_medis' // ganti dengan nama DB kamu
});

module.exports = pool;


// require('dotenv').config();
// const mysql = require('mysql2');

// // Parse DATABASE_URL dari .env
// const dbUrl = new URL(process.env.DATABASE_URL);

// // Gunakan pool, bukan single connection
// const pool = mysql.createPool({
//   host: dbUrl.hostname,
//   port: dbUrl.port,
//   user: dbUrl.username,
//   password: dbUrl.password,
//   database: dbUrl.pathname.replace('/', ''),
//   waitForConnections: true,
//   connectionLimit: 10,       // jumlah maksimal koneksi bersamaan
//   queueLimit: 0              // unlimited queue
// });

// module.exports = pool;
