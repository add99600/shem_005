const oracledb = require('oracledb');
const dbConfig = require('./dbconnect/dbConfig');


function user_model() {
oracledb.getConnection(dbConfig, function(err, connection) {
    if (err) {
      console.error(err.message);
      return;
    }
    connection.execute(
      `CREATE TABLE v2_user (
        id VARCHAR2(100) NOT NULL, 
        name VARCHAR2(100) NOT NULL, 
        password VARCHAR2(100) NOT NULL, 
        email VARCHAR2(100) NOT NULL
      )`,
      function(err, result) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log(result);
      });
  });
}
  module.exports = { user_model };