const sql = require('msnodesqlv8');

const connectionString = "Server=localhost\\SQLEXPRESS;Database=Rekam_Medis;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
module.exports = {
  query: (sqlQuery, callback) => {
    sql.query(connectionString, sqlQuery, callback);
  }
};
