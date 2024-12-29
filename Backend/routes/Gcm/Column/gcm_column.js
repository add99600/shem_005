const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../../models/dbconnect/db_connect')

router.get('/api/gcm/column', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const result = await connection.execute(`
      SELECT *
      FROM gcm_column_main`
    );

    // 각 행을 객체로 변환
    const data = result.rows.map(row => {
      let obj = {};
      row.forEach((item, index) => {
          // null 값이 아닌 경우에만 객체에 추가
          // if (item !== null) {
               obj[result.metaData[index].name] = item;
          // }
      });
      return obj;
    });
    
    const columnNames = Object.keys(data[0]);

    res.status(200).json({ success: true, data: data, column: columnNames });


  } catch (err) {
    console.error(err);
  }
})


router.post('/api/gcm/column/insert', async (req, res) => {
    let connection;
    try{
      connection = await getDBConnection();
  
      const data = JSON.parse(req.body.data);
      console.log(data)
  
      const keys = Object.keys(data).join(', ');
      const values = Object.values(data);
  
      // bind 변수 동적생성
      const binds = values.map((_, i) => `:${i+1}`).join(', ');
      // 데이터가 이미 존재하는지 확인
      const conditions = Object.keys(data).map((_, i) => `${_} = :${i+1}`).join(' AND ');
      const checkResult = await connection.execute(`
        SELECT COUNT(*) AS count
        FROM gcm_column_main
        WHERE ${conditions}`, 
        values);
  
      // 데이터가 존재하지 않으면 삽입
      if (checkResult.rows[0][0] === 0) {
        const result = await connection.execute(`
          INSERT INTO gcm_column_main
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
    }
})

router.delete('/api/gcm/column/delete', async (req, res) => {
    let connection;
    try{
      connection = await getDBConnection();
  
      const data = JSON.parse(req.query.data);
  
      console.log(data)
  
      const keys = Object.keys(data);
      const values = Object.values(data);
  
      // 값이 null이 아닌 키와 값을 필터링
      const filteredKeys = keys.filter((key, i) => values[i] !== null);
      const filteredValues = values.filter(value => value !== null);
          
      const binds = filteredKeys.map((key, i) => `${key} = :${i+1}`).join(' AND ');
  
      const result = await connection.execute(`
      DELETE FROM gcm_column_main
      WHERE ${binds}`, 
      filteredValues, { autoCommit: true });
  
      console.log(result)
  
      res.status(200).json({ success: true });
  
    } catch (err) {
      console.error(err);
    }
})


router.put('/api/gcm/column/update', async (req, res) => {
    let connection;
    try{
      connection = await getDBConnection();
  
      const data = JSON.parse(req.body.data);
  
      console.log(data)
  
      const keys = Object.keys(data);
      const values = Object.values(data);
  
      // bind 변수 동적생성
      const binds = keys.map((key, i) => `${key} = :${i+1}`).join(', ');
  
      // 데이터 객체를 바인딩 변수로 변환
      const bindVars = keys.reduce((acc, key, i) => {
        acc[`${i+1}`] = data[key];
        return acc;
      }, {});
  
      console.log(binds)
      console.log(bindVars)
  
      // table_name은 수정 불가
      const result = await connection.execute(`
        UPDATE gcm_column_main
        SET ${binds}
        WHERE table_name = :table_name`, 
        { ...bindVars, table_name: data.TABLE_NAME}, { autoCommit: true });
  
      console.log(result)
  
      res.status(200).json({ success: true });
  
    } catch (err) {
      console.error(err);
    }
});

module.exports = router;