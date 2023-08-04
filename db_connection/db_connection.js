const mysql = require("mysql2");

// Create a persistent connection pool (createPool automatically manages connections)
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "crud",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export the connection pool
module.exports = pool.promise(); // Use pool.promise() to use the promise-based API for queries
