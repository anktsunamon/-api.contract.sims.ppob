let mysql = require('mysql2');
const customConfig = require("../custom-config");

const connection = mysql.createConnection({
  uri: 'mysql://root:mbAGnEYoDHNTLBAWlazwBYvlGAqxXILF@junction.proxy.rlwy.net:36875/railway'
});

// const connection = mysql.createConnection({
//   host: customConfig.host,
//   user: customConfig.user,
//   password: customConfig.password,
//   database: customConfig.database,
// });

module.exports = connection;