const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../models/dbconnect/db_connect');
const oracledb = require('oracledb');

router.get('/api/all/table/:table', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const table = req.params.table

    console.log('테이블명:', table)

    const sql = `
        SELECT *
        FROM ${table}`

    const result = await connection.execute(sql);

    // column과 데이터를 key:value 형태로 변환
    // const data = result.rows.map(row => {
    //   let obj = {};
    //     row.forEach((item, index) => {
    //       obj[result.metaData[index].name] = item;
    //     });
    //   return obj;
    // });

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
          obj[result.metaData[index].name] = data;
        } else {
          obj[result.metaData[index].name] = item;
        }
      }));
      return obj;
    }));

    console.log(data)

    const columnNames = Object.keys(data[0]);

    res.status(200).json({ success: true, data: data, column: columnNames})

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false })
  }
})


router.post('/api/all/table/:table', async (req, res) => {
    let connection;
    try {
      connection = await getDBConnection();
  
      const table = req.params.table;
  
      // 데이터 형식에 따라 처리
      let data;
      if (typeof req.body.data === 'string') {
        try {
          data = JSON.parse(req.body.data);
        } catch (error) {
          return res.status(400).json({ success: false, message: '유효하지 않은 JSON 형식입니다.' });
        }
      } else if (typeof req.body.data === 'object') {
        data = req.body.data;
      } else {
        data = req.body;
      }
      console.log(data);
  
      // 모든 필드를 검사하여 JSON 데이터를 처리
      const processedData = {};
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value) || typeof value === 'object') {
          processedData[key] = JSON.stringify(value);
          console.log('json', processedData)
        } else {
          processedData[key] = value;
          console.log('일반', processedData)
        }
      }

      console.log(processedData);
  
      const keys = Object.keys(processedData).join(', ');
      const values = Object.values(processedData);
      const binds = values.map((_, i) => `:${i + 1}`).join(', ');
  
      const sql = `
        INSERT INTO ${table} (${keys})
        VALUES (${binds})
      `;
      const result = await connection.execute(sql, values, { autoCommit: true });
      console.log('결과', result);
      res.status(200).json({ success: true, message: '데이터가 성공적으로 저장되었습니다.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: '데이터 저장 중 오류가 발생했습니다.' });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  });

router.delete('/api/all/table/:table', async (req, res) => {
    let connection;
    try{
      connection = await getDBConnection();

      const table = req.params.table
  
      const data = JSON.parse(req.query.data);

      // postman으로 받을 때
      // const data = req.body.data;

      // keys:values 값을 각각 분할
      const keys = Object.keys(data);
      const values = Object.values(data);
  
      // 값이 null이 아닌 키와 값을 필터링
      const filteredKeys = keys.filter((key, i) => values[i] !== null);
      const filteredValues = values.filter(value => value !== null);
      
      const binds = filteredKeys.map((key, i) => `${key} = :${i+1}`).join(' AND ');
  
      const result = await connection.execute(`
      DELETE FROM ${table}
      WHERE ${binds}`, 
      filteredValues, { autoCommit: true });
  
      console.log(result)
  
      res.status(200).json({ success: true });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
})

router.put('/api/all/table/:table', async (req, res) => {
    let connection;
    try{
      connection = await getDBConnection();

      const table = req.params.table
  
      const data = JSON.parse(req.body.data);

      // postman으로 받을 때
      // const data = req.body.data;
  
      const id = req.body.id
  
      // ID를 배열에서 제거
      const keys = Object.keys(data).filter(key => key !== 'ID');
  
      // bind 변수 동적생성
      const binds = keys.map((key, i) => `${key} = :${i+1}`).join(', ');
  
      // 데이터 객체를 바인딩 변수로 변환
      const bindVars = keys.reduce((acc, key, i) => {
        acc[`${i+1}`] = data[key];
        return acc;
      }, {});
  
      console.log('바인드:', binds)
      console.log('바인딩 변수', bindVars)
  
      const result = await connection.execute(`
        UPDATE ${table}
        SET ${binds}
        WHERE id = :id`, 
        { ...bindVars, id}, 
        { autoCommit: true }
      );
  
      console.log(result)
  
      res.status(200).json({ success: true });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
  });



module.exports = router;