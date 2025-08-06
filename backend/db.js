const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // for Azure SQL
    trustServerCertificate: true // for local dev
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Connected to MSSQL');
    return pool;
  })
  .catch(err => {
    console.error('❌ MSSQL Connection Failed:', err);
  });

module.exports = { sql, poolPromise };