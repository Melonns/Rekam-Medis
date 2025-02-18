const sql = require('msnodesqlv8');

const connectionString = "server=.;Database=tesdb;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
const query = "SELECT * FROM Pasien";

sql.query(connectionString, query, (err, rows) =>{
    console.log(rows);
})