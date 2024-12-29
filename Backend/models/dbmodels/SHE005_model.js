const oracledb = require('oracledb');
const dbConfig = require('../dbconnect/db_config');


function SHE005_model() {
  oracledb.getConnection(dbConfig, function(err, connection) {
    if (err) {
      console.error(err.message);
      return;
    }
    connection.execute(
      `CREATE TABLE testSHEM005
      (
        ID               NUMBER GENERATED ALWAYS AS IDENTITY ,
        SUBJECT          VARCHAR2(100)  NOT NULL ,
        MANAGER          VARCHAR2(100)  NOT NULL ,
        COMPANY_NM       VARCHAR2(100)  NOT NULL ,
        COMPANY_MAN      VARCHAR2(100)  NOT NULL ,
        WORK_NUM         INTEGER        NOT NULL ,
        TYPES            VARCHAR2(100)  NOT NULL ,
        TYPES_D          VARCHAR2(100)  NOT NULL ,
        LOCATION         VARCHAR2(100)  NOT NULL ,
        LOCATION_D       VARCHAR2(100)  NOT NULL ,
        HEAVY_CD         VARCHAR2(100)  NOT NULL ,
        STRT_DT          VARCHAR2(100)  NOT NULL ,
        END_DT           VARCHAR2(100)  NOT NULL ,
        CONTENT          VARCHAR2(1000) NOT NULL ,
        ETC_CONTENT      VARCHAR2(100)  NULL     ,
        ISRT_ID          VARCHAR2(100)  NOT NULL ,
        ISRT_DT          TIMESTAMP      NOT NULL ,
        API_COMPANY_NAME VARCHAR2(100)  NULL     ,
        API_COMPANY_H_ID VARCHAR2(100)  NULL     ,
        COUNTRY          INTEGER        NULL     ,
        DEPARTMENT       VARCHAR2(100)  NULL     ,
        DELETED          VARCHAR2(100)  NULL     ,
        PRIMARY KEY (ID)
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

module.exports = { SHE005_model };
