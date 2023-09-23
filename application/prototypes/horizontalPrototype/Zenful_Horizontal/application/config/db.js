const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "zenful_db",
  password: "root",
});

module.exports = db.promise();