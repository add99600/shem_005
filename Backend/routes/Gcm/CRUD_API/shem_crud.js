const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../../models/dbconnect/db_connect');
const oracledb = require('oracledb');

router.get('/api/shem/:table', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const table = req.params.table;
    // DELETED 컬럼 존재 여부 확인
   const checkColumnSql = `
     SELECT COUNT(*) as COUNT
     FROM ALL_TAB_COLUMNS
     WHERE TABLE_NAME = :tableName
     AND COLUMN_NAME = 'DELETED'`;
    const columnCheck = await connection.execute(checkColumnSql, 
     [table.toUpperCase()]);
   
   // 실행할 SQL 쿼리 결정
   const sql = columnCheck.rows[0][0] > 0 
     ? `SELECT * FROM ${table} WHERE DELETED IS NULL`
     : `SELECT * FROM ${table}`;
    const result = await connection.execute(sql);

    // column과 데이터를 key:value 형태로 변환
    const data = await Promise.all(result.rows.map(async row => {
      let obj = {};
      await Promise.all(row.map(async (item, index) => {
        if (item instanceof oracledb.Lob) {
          let data = '';
          item.setEncoding('utf8');
          for await (const chunk of item) {
            data += chunk;
          }
          try {
            obj[result.metaData[index].name] = JSON.parse(data); // JSON 파싱
          } catch (e) {
            obj[result.metaData[index].name] = data; // JSON 파싱 실패 시 원본 데이터 사용
          }
        } else {
          obj[result.metaData[index].name] = item;
        }
      }));
      return obj;
    }));

    const columnNames = Object.keys(data[0]);

    res.status(200).json({ success: true, data: data, column: columnNames})

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false })
  }
})


router.post('/api/shem/:table', async (req, res) => {
    let connection;
    try{
      connection = await getDBConnection();

      const table = req.params.table

      console.log(table)

      console.log(req.body)

      // Oracle에서 컬럼 타입을 확인하는 SQL 쿼리
      const checkColumnTypeSQL = `
      SELECT *
      FROM ${table}
      `;

      // 컬럼 타입 확인
      const result1 = await connection.execute(checkColumnTypeSQL);
      const extractedData = result1.metaData.map(item => ({
        name: item.name,
        dbTypeName: item.dbTypeName
      }));

      // CLOB 타입 컬럼만 추출
      const clobData = extractedData
        .filter(item => item.dbTypeName === 'CLOB')
        .map(item => item.name);
      console.log(clobData);

      // 테이블 데이터로 받을 때
      // const data = JSON.parse(req.body.data);

      // postman으로 받을 때
      const data = req.body.data;
      console.log(data)
  
      // key가 ID인 경우 제외
      const filteredData = Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'ID'));
      const keys = Object.keys(filteredData).join(', ');
      const values = Object.values(filteredData);
      console.log('key, value: ',keys, values)
  
      // bind 변수 동적생성 ex) :1, :2, :3
      const binds = values.map((_, i) => `:${i+1}`).join(', ');
      console.log('bind: ',binds)

      // 데이터가 이미 존재하는지 확인 ex) _ = :1 AND _ = :2 AND ...
      const conditions = Object.keys(filteredData)
        .map((key, i) => {
          if (clobData.includes(key)) {
            return `DBMS_LOB.COMPARE("${key}", TO_CLOB(:${i+1})) = 0`;
          }
          return `"${key}" = :${i+1}`;
        })
        .join(' AND ');

      console.log('conditions', conditions)

      const checkResult = await connection.execute(`
        SELECT COUNT(*) AS count
        FROM ${table}
        WHERE ${conditions}`, 
        values);

      console.log('check',checkResult.rows);

        // keys와 values를 동시에 순회합니다.
        let sqlValues = [];
        for (let i = 0; i < keys.length; i++) {
          if (clobData.includes(keys[i])) {
            sqlValues.push(`to_clob('${values[i]}')`);
          } else {
            sqlValues.push(`'${values[i]}'`);
          }
        }
        sqlValues = sqlValues.join(', ')
      
      
      // 데이터가 존재하지 않으면 삽입
      if (checkResult.rows[0][0] === 0) {
        const result = await connection.execute(`
          INSERT INTO ${table}
          (${keys})
          VALUES 	
          (${binds})`, 
          values, { autoCommit: true });

        console.log(result)
        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ success: false, message: '동일한 데이터가 존재합니다' });
      }
    
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
})

router.delete('/api/shem/:table/:id', async (req, res) => {
    let connection;
    try{
      connection = await getDBConnection();

      const table = req.params.table

      const id = req.params.id

      console.log(table, id)

      const result = await connection.execute(`
        UPDATE ${table}
        SET DELETE_DT = CURRENT_TIMESTAMP, DELETED = 'Y'
        WHERE id = :id`, 
        {id}, { autoCommit: true });

      console.log(result)
  
      res.status(200).json({ success: true });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
})

router.put('/api/shem/:table', async (req, res) => {
    let connection;
    try{
      connection = await getDBConnection();

      const table = req.params.table
  
      //const data = JSON.parse(req.body.data);

      // postman으로 받을 때
      const data = req.body.data;
  
      const id = req.body.id

      console.log(table, data, id)
  
      // ID를 배열에서 제거
      const keys = Object.keys(data)
        .filter(key => key !== 'ID' && key !== 'UPDT_DT' && key !== 'DELETE_DT');
  
      // bind 변수 동적생성
      const binds = keys.map((key, i) => `${key} = :${i+1}`).join(', ');
  
      // 데이터 객체를 바인딩 변수로 변환
      const bindVars = keys.reduce((acc, key, i) => {
        if (data[key] === null) {
            acc[`${i+1}`] = null;
        } else if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
            acc[`${i+1}`] = { val: JSON.stringify(data[key]), type: oracledb.STRING, maxSize: 4000 };
        } else if (Array.isArray(data[key])) {
            acc[`${i+1}`] = { val: JSON.stringify(data[key]), type: oracledb.STRING, maxSize: 4000 };
        } else if (key.endsWith('_DT')) {
            // 날짜 형식 처리
            acc[`${i+1}`] = { val: new Date(data[key]), type: oracledb.DATE };
        } else {
            acc[`${i+1}`] = data[key];
        }
        return acc;
    }, {});

      // 조건에 따라 WHERE 절과 바인딩 변수 설정
      let whereClause = '';
      if (data.MENU_ID) {
        whereClause = 'WHERE MENU_ID = :MENU_ID';
        bindVars.MENU_ID = data.MENU_ID;
      }
      else if (data.TEMPLATE_ID) {
        whereClause = 'WHERE TEMPLATE_ID = :TEMPLATE_ID';
        bindVars.TEMPLATE_ID = data.TEMPLATE_ID;
      }
      else if (data.DATA2) {
        whereClause = 'WHERE DATA2 = :DATA2';
        bindVars.DATA2 = data.DATA2;
      }
      else if(data.ID){
        whereClause = 'WHERE id = :id';
        bindVars.ID = id;
      }
      else{
        whereClause = 'WHERE id = :id';
        bindVars.id = id;
      }
  
      // 실행될 쿼리 문자열 출력
      const queryString = `
        UPDATE ${table}
        SET ${binds}, UPDT_DT = CURRENT_TIMESTAMP
        ${whereClause}`;
      
      console.log('Query:', queryString);
      console.log('Bind variables:', bindVars);

      const result = await connection.execute(
        queryString, 
        bindVars, 
        { autoCommit: true }
      );

      console.log('Query result:', result);

  
      res.status(200).json({ success: true });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
  });

module.exports = router;