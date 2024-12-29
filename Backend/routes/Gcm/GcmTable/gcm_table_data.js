const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../../models/dbconnect/db_connect')

router.get('/api/gcm/crud/sub/data', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const data_result = await connection.execute(`
      SELECT *
      FROM gcm_crud_data`
    );

    // 각 행을 객체로 변환
    const data = data_result.rows.map(row => {
      let obj = {};
      row.forEach((item, index) => {
          // // null 값이 아닌 경우에만 객체에 추가
          // if (item !== null) {
               obj[data_result.metaData[index].name] = item;
          // }
      });
      return obj;
    });

    const result = await connection.execute(`
        SELECT *
        FROM gcm_crud_main`
    );

    // 각 행을 객체로 변환
    const main = result.rows.map(row => {
        let obj = {};
        row.forEach((item, index) => {
            // null 값이 아닌 경우에만 객체에 추가
            if (item !== null) {
                obj[result.metaData[index].name] = item;
            }
        });
        return obj;
    });

    const columnNames = Object.keys(data[0]);

    res.status(200).json({ success: true, data: data, main: main, column: columnNames})

  } catch (err) {
    console.error(err);
  }
})

router.post('/api/gcm/crud/sub/insert', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const data = JSON.parse(req.body.data);
    console.log(data)

    const filteredData = Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'ID'));
    const keys = Object.keys(filteredData).join(', ');
    const values = Object.values(filteredData);

    // bind 변수 동적생성
    const binds = values.map((_, i) => `:${i+1}`).join(', ');
    // 데이터가 이미 존재하는지 확인
    const conditions = Object.keys(filteredData).map((_, i) => `${_} = :${i+1}`).join(' AND ');
    const checkResult = await connection.execute(`
      SELECT COUNT(*) AS count
      FROM gcm_crud_data
      WHERE ${conditions}`, 
      values);

    // 데이터가 존재하지 않으면 삽입
    if (checkResult.rows[0][0] === 0) {
      const result = await connection.execute(`
        INSERT INTO gcm_crud_data
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

router.delete('/api/gcm/crud/sub/delete', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const data = JSON.parse(req.query.data);

    const keys = Object.keys(data);
    const values = Object.values(data);

    // 값이 null이 아닌 키와 값을 필터링
    const filteredKeys = keys.filter((key, i) => values[i] !== null);
    const filteredValues = values.filter(value => value !== null);
    
    const binds = filteredKeys.map((key, i) => `${key} = :${i+1}`).join(' AND ');

    const result = await connection.execute(`
    DELETE FROM gcm_crud_data
    WHERE ${binds}`, 
    filteredValues, { autoCommit: true });

    console.log(result)

    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
  }
})

router.put('/api/gcm/crud/sub/update', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const data = JSON.parse(req.body.data);

    const id = req.body.id

    console.log(data)

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
      UPDATE gcm_crud_data
      SET ${binds}
      WHERE id = :id`, 
      { ...bindVars, id}, 
      { autoCommit: true });

    console.log(result)

    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
  }
});

module.exports = router;