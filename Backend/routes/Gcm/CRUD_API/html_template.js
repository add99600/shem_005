const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../../models/dbconnect/db_connect');
const oracledb = require("oracledb");

// html 데이터 삽입
router.post('/api/shem/:table/html', async (req, res) => {
    let connection;
    try {
        connection = await getDBConnection();

        const table = req.params.table;

        // 컬럼, 타입 조회
        const checkColumnTypeSQL = `
          SELECT column_name, data_type
          FROM user_tab_columns
          WHERE table_name = UPPER(:1)`;

        // {컬럼, 타입} 형태로 변환
        const result1 = await connection.execute(checkColumnTypeSQL, [table]);
        const columnTypes = result1.rows.reduce((acc, [name, type]) => {
          acc[name] = type;
          return acc;
        }, {});

        const data = req.body.data;
        console.log(data);

        // ID 중복 체크
        if (data.ID) {
          const checkIdSQL = `
          SELECT COUNT(*) AS count
          FROM ${table}
          WHERE ID = :1`;
          const idCheckResult = await connection.execute(checkIdSQL, [data.ID]);
          if (idCheckResult.rows[0][0] > 0) {
            return res.status(409).json({ success: false, message: '동일한 ID가 이미 존재합니다.' });
          }
        }

        const keys = Object.keys(data)
        
        // 바인드 객체 생성
        const bindObj = {};
        keys.forEach((key, index) => {
            if (columnTypes[key] === 'CLOB') {
                bindObj[`clob${index}`] = { type: oracledb.CLOB, dir: oracledb.BIND_IN, val: data[key] };
            } else {
                bindObj[`val${index}`] = data[key];
            }
        });

        // INSERT 쿼리 생성
        const placeholders = keys.map((key, index) => 
            columnTypes[key] === 'CLOB' ? `:clob${index}` : `:val${index}`
        ).join(', ');

        const insertSQL = `
        INSERT INTO ${table} (${keys.join(', ')})
        VALUES (${placeholders})
        `;

        // 데이터 삽입 실행
        const result = await connection.execute(insertSQL, bindObj, { autoCommit: true });
        
        console.log(result);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
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

router.put('/api/shem/:table/html', async (req, res) => {
    let connection;
    try {
        connection = await getDBConnection();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
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


module.exports = router;