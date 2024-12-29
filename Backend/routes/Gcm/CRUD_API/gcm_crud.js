const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../../models/dbconnect/db_connect');
const oracledb = require('oracledb');

router.get('/api/gcm/:table', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    const table = req.params.table;

    console.log('테이블명:', table);

    const sql = `
        SELECT *
        FROM ${table}`;

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
    const data = await Promise.all(
      result.rows.map(async (row) => {
        let obj = {};
        await Promise.all(
          row.map(async (item, index) => {
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
          }),
        );
        return obj;
      }),
    );

    console.log(data);

    const columnNames = Object.keys(data[0]);

    res.status(200).json({ success: true, data: data, column: columnNames });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.post('/api/gcm/:table', async (req, res) => {
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
        return res
          .status(400)
          .json({ success: false, message: '유효하지 않은 JSON 형식입니다.' });
      }
    } else if (typeof req.body.data === 'object') {
      data = req.body.data;
    } else {
      data = req.body;
    }

    console.log(data);

    // check_sql_manage의 경우
    if (table === 'check_sql_manage') {
      const id = data.id;
      const description = data.description;
      const sql_detail = data.sql_detail;
      // const insert_time = data.insert_time

      const checkResult = await connection.execute(
        `
          SELECT COUNT(*) AS count
          FROM ${table}
          WHERE id = :id`,
        [id],
      );

      if (checkResult.rows[0][0]) {
        return res
          .status(401)
          .json({ success: false, message: '동일 ID가 존재합니다' });
      }

      const result = await connection.execute(
        `INSERT INTO ${table} 
          (id, description, sql_detail) 
          VALUES 
          (:id, :description, EMPTY_CLOB()) RETURNING sql_detail INTO :lobbv`,
        {
          id: id,
          description: description,
          lobbv: { type: oracledb.CLOB, dir: oracledb.BIND_OUT },
        },
        { autoCommit: false },
      );

      const lob = result.outBinds.lobbv[0];
      await lob.write(sql_detail);
      await connection.commit();
      console.log(result);
      res
        .status(200)
        .json({ success: true, message: 'sql문이 저장되었습니다' });
    }
    // regist_sql의 경우
    else if (table === 'regist_sql') {
      const regist_id = data.regist_id;
      const description = data.description;
      const insert_sql = data.insert_sql;
      const update_sql = data.update_sql;
      const delete_sql = data.delete_sql;

      // const insert_time = data.insert_time

      const checkResult = await connection.execute(
        `
          SELECT COUNT(*) AS count
          FROM ${table}
          WHERE regist_id = :regist_id`,
        [regist_id],
      );

      if (checkResult.rows[0][0]) {
        return res
          .status(401)
          .json({ success: false, message: '동일 ID가 존재합니다' });
      }

      const result = await connection.execute(
        `INSERT INTO ${table} 
          (regist_id, description, insert_sql, update_sql, delete_sql) 
          VALUES 
          (:regist_id, :description, EMPTY_CLOB(), EMPTY_CLOB(), EMPTY_CLOB()) 
          RETURNING insert_sql, update_sql, delete_sql INTO :insert_sql, :update_sql, :delete_sql`,
        {
          regist_id: regist_id,
          description: description,
          insert_sql: { type: oracledb.CLOB, dir: oracledb.BIND_OUT },
          update_sql: { type: oracledb.CLOB, dir: oracledb.BIND_OUT },
          delete_sql: { type: oracledb.CLOB, dir: oracledb.BIND_OUT },
        },
        { autoCommit: false },
      );

      const insertSqlLob = result.outBinds.insert_sql[0];
      const updateSqlLob = result.outBinds.update_sql[0];
      const deleteSqlLob = result.outBinds.delete_sql[0];

      await insertSqlLob.write(insert_sql);
      await updateSqlLob.write(update_sql);
      await deleteSqlLob.write(delete_sql);

      await connection.commit();

      console.log(result);
      res
        .status(200)
        .json({ success: true, message: 'sql문이 저장되었습니다' });
    } else {
      // key가 id인 경우 제외
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== 'ID'),
      );
      const keys = Object.keys(filteredData).join(', ');
      const values = Object.values(filteredData);
      console.log(keys, values);

      // bind 변수 동적생성 ex) :1, :2, :3
      const binds = values.map((_, i) => `:${i + 1}`).join(', ');
      // console.log(binds)

      // 데이터가 이미 존재하는지 확인 ex) _ = :1 AND _ = :2 AND ...
      const conditions = Object.keys(filteredData)
        .map((_, i) => `${_} = :${i + 1}`)
        .join(' AND ');
      const checkResult = await connection.execute(
        `
        SELECT COUNT(*) AS count
        FROM ${table}
        WHERE ${conditions}`,
        values,
      );

      // 데이터가 존재하지 않으면 삽입
      if (checkResult.rows[0][0] === 0) {
        const result = await connection.execute(
          `
          INSERT INTO ${table}
          (${keys})
          VALUES 	
          (${binds})`,
          values,
          { autoCommit: true },
        );
        console.log('결과', result);
        res.status(200).json({ success: true });
      } else {
        res
          .status(401)
          .json({ success: false, message: '동일한 데이터가 존재합니다' });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.delete('/api/gcm/:table', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    const table = req.params.table;

    let data;
    if (typeof req.body.data === 'string') {
      try {
        data = JSON.parse(req.body.data);
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, message: '유효하지 않은 JSON 형식입니다.' });
      }
    } else if (typeof req.body.data === 'object') {
      data = req.body.data;
    } else {
      data = req.body;
    }

    // keys:values 값을 각각 분할
    const keys = Object.keys(data);
    const values = Object.values(data);

    // 값이 null이 아닌 키와 값을 필터링
    const filteredKeys = keys.filter((key, i) => values[i] !== null);
    const filteredValues = values.filter((value) => value !== null);

    const binds = filteredKeys
      .map((key, i) => `${key} = :${i + 1}`)
      .join(' AND ');

    const result = await connection.execute(
      `
      DELETE FROM ${table}
      WHERE ${binds}`,
      filteredValues,
      { autoCommit: true },
    );

    console.log(result);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.put('/api/gcm/:table', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    const table = req.params.table;
    let data;
    try {
      data = JSON.parse(req.body.data);
    } catch (e) {
      data = req.body.data;
    }
    const id = req.body.id;

    // ID를 배열에서 제거
    const keys = Object.keys(data).filter((key) => key !== 'ID');

    // bind 변수 동적생성
    const binds = keys.map((key, i) => `${key} = :${i + 1}`).join(', ');

    // 데이터 객체를 바인딩 변수로 변환
    const bindVars = keys.reduce((acc, key, i) => {
      acc[`${i + 1}`] = data[key];
      return acc;
    }, {});

    let whereClause = '';
    if (data.regist_id) {
      whereClause = 'WHERE regist_id = :regist_id';
      bindVars.regist_id = data.regist_id;
    } else {
      whereClause = 'WHERE id = :id';
      bindVars.id = id;
    }

    console.log('바인드:', binds);
    console.log('바인딩 변수', bindVars);

    const result = await connection.execute(
      `
        UPDATE ${table}
        SET ${binds}
        ${whereClause}`,
      { ...bindVars },
      { autoCommit: true },
    );

    console.log(result);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
