let mysql = require('mysql2');
const customConfig = require("../custom-config");

const connection = mysql.createConnection({
  host: customConfig.host,
  user: customConfig.user,
  password: customConfig.password,
  database: customConfig.database,
});

module.exports = connection;