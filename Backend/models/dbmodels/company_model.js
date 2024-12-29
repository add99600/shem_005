const oracledb = require('oracledb');
const dbConfig = require('./dbconnect/dbConfig');


function company_model() {
  oracledb.getConnection(dbConfig, function(err, connection) {
    if (err) {
      console.error(err.message);
      return;
    }
    connection.execute(
      `CREATE TABLE company (
        companyName VARCHAR2(100) NOT NULL, 
        regNumber1 NUMBER NOT NULL, 
        regNumber2 NUMBER NOT NULL,
        regNumber3 NUMBER NOT NULL,
        masterName NUMBER NOT NULL,
        address VARCHAR2(100) NOT NULL,
        regDate TIMESTAMP NOT NULL
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

module.exports = { company_model };
