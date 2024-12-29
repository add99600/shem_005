const dbConfig = require('./db_config');
const oracledb = require("oracledb");

try {
  oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_23_5' });
} catch (err) {
  console.error('Oracle Client initialization error:', err);
  process.exit(1);
}

// DB 연결 설정
async function getDBConnection() {
  let connection = await oracledb.getConnection({
    user: dbConfig.hmshe.user,
    password: dbConfig.hmshe.password,
    connectString: dbConfig.hmshe.connectString,
  });
  return connection;
}

async function getLog_DBConnection() {
  let connection = await oracledb.getConnection({
    user: dbConfig.epinf.user,
    password: dbConfig.epinf.password,
    connectString: dbConfig.epinf.connectString,
  });
  return connection;
}

module.exports = { getDBConnection, getLog_DBConnection };
