const sql = require('msnodesqlv8');

// Connection string untuk SQL Server lokal dengan Trusted Connection
const connectionString = "Driver={ODBC Driver 17 for SQL Server};Server=localhost\\SQLEXPRESS;Database=Rekam_Medis;Trusted_Connection=Yes;";

module.exports = {
  query: (sqlQuery, callback) => {
    sql.query(connectionString, sqlQuery, (err, rows) => {
      if (err) {
        console.error("Query gagal:", err);
        return callback(err, null);
      }
      callback(null, rows);
    });
  }
};
