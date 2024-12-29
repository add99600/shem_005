const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../models/dbconnect/db_connect');
const oracledb = require('oracledb');


router.post('/api/risk/insert/:table', async (req, res) => {
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
        
        // 배열 데이터를 문자열로 변환
        for (let key in data) {
            if (Array.isArray(data[key])) {
                // 배열을 JSON 문자열로 변환
                data[key] = JSON.stringify(data[key]);
            }
        }

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

                // keys와 values 배열 생성
                const keysArray = Object.keys(data);
                const valuesArray = Object.values(data);
        
                // ISRT_DT와 UPDT_DT가 없다면 추가
                if (!keysArray.includes('ISRT_DT')) {
                    keysArray.push('ISRT_DT');
                    valuesArray.push('CURRENT_TIMESTAMP');
                }
                if (!keysArray.includes('UPDT_DT')) {
                    keysArray.push('UPDT_DT');
                    valuesArray.push('CURRENT_TIMESTAMP');
                }
      
        // 바인드 변수 객체 생성
        const bindParams = {};
        keysArray.forEach((key, index) => {
            if (key !== 'ISRT_DT' && key !== 'UPDT_DT') {
                bindParams[key] = data[key];
            }
        });

        // INSERT 쿼리 생성
        const sql = `
            INSERT INTO ${req.params.table} 
            (${keysArray.join(', ')}) 
            VALUES 
            (${keysArray.map(key => 
                key === 'ISRT_DT' || key === 'UPDT_DT' 
                ? 'SYSDATE' 
                : ':' + key
            ).join(', ')})
        `;

        console.log('SQL:', sql);
        console.log('Bind Params:', bindParams);

        // 쿼리 실행
        const result = await connection.execute(sql, bindParams, { autoCommit: true });

        res.status(200).json({
            success: true,
            message: '데이터가 성공적으로 삽입되었습니다.',
            rowsAffected: result.rowsAffected
        });
    
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
})

// 유저가 작성한 데이터 조회
router.get('/api/risk/get/:table/:id', async (req, res) => {
    let connection;
    try {
      connection = await getDBConnection();
  
      const { table, id } = req.params;  // URL 파라미터 추출

      console.log(table, id)
  
      let sql = `
        select *
        from ${table}
        where ISRT_ID = :id
      `
      const result = await connection.execute(sql, [id], {
        fetchInfo: {
          "CONTENTS": { type: oracledb.STRING },  // CLOB 컬럼을 문자열로 가져오기
        },
        outFormat: oracledb.OUT_FORMAT_OBJECT    // 결과를 객체 형태로 반환
      });
      
      // 각 행을 객체로 변환
      const data = await Promise.all(result.rows.map(async row => {
        const obj = { ...row };  // 기존 데이터 복사
        
        const clobColumns = {
          'SAFETY_BASIC_NEW': ['SELECTED_PROCESS', 'PROCESS_DESCRIPTIONS', 'SELECTED_MACHINES'],
        };
  
        // CLOB 데이터 처리
        if (clobColumns[table]) {
          for (const columnName of clobColumns[table]) {
            if (obj[columnName]) {
              try {
                // CLOB 데이터가 JSON 형식인 경우
                if (typeof obj[columnName] === 'string' && 
                    (obj[columnName].startsWith('{') || obj[columnName].startsWith('['))) {
                  obj[columnName] = JSON.parse(obj[columnName]);
  
                // Stream 형식의 CLOB 데이터 처리
                } else if (obj[columnName].setEncoding) {
                  obj[columnName] = await new Promise((resolve, reject) => {
                    let data = '';
                    obj[columnName].setEncoding('utf8');
                    obj[columnName].on('data', chunk => data += chunk);
                    obj[columnName].on('end', () => {
                      try {
                        // JSON 파싱 시도
                        resolve(data.startsWith('{') || data.startsWith('[') ? 
                               JSON.parse(data) : data);
                      } catch (error) {
                        console.error('JSON 파싱 에러:', error);
                        resolve(data);  // 일반 텍스트로 처리
                      }
                    });
                    obj[columnName].on('error', reject);
                  });
                }
              } catch (error) {
                console.error(`${columnName} 처리 중 에러:`, error);
                obj[columnName] = null;
              }
            }
          }
        }
  
        return obj;
      }));
  
      console.log('data', data)
  
      res.status(200).json({ success: true, data: data });
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });

// 유저가 작성한 데이터 수정
router.put('/api/risk/update/:table/:risk_id', async (req, res) => {
    let connection;
    try {
        connection = await getDBConnection();

        await connection.execute(
            `ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY/MM/DD HH24:MI:SS'`
        );

        const { table, risk_id } = req.params;

        console.log(table, risk_id)

        const data = req.body;

        const keys = Object.keys(data)
        .filter(key => key !== 'RISK_ID' && key !== 'DELETE_DT' && key !== 'ID');
    
        // bind 변수 동적생성
        const binds = keys.map((key, i) => {
            if (key === 'UPDT_DT') {
                return `${key} = SYSDATE`;  // UPDT_DT는 SYSDATE로 직접 설정
            }
            return `${key} = :${i+1}`;
        }).join(', ');

        // 데이터 객체를 바인딩 변수로 변환
        const bindVars = keys.reduce((acc, key, i) => {
            if (key === 'UPDT_DT') {
                return acc; // UPDT_DT는 SYSDATE로 처리되므로 건너뛰기
            }

            if (data[key] === null) {
                acc[`${i+1}`] = null;
            } else if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
                acc[`${i+1}`] = { 
                    val: JSON.stringify(data[key]), 
                    type: oracledb.STRING, 
                    maxSize: 4000 
                };
            } else if (Array.isArray(data[key])) {
                acc[`${i+1}`] = { 
                    val: JSON.stringify(data[key]), 
                    type: oracledb.STRING, 
                    maxSize: 4000 
                };
            } else if (key.endsWith('_DT') || key.includes('DATE')) {  // DATE가 포함된 필드도 처리
                if (data[key]) {  // 날짜가 있는 경우만 처리
                    acc[`${i+1}`] = { 
                        val: new Date(data[key]),
                        type: oracledb.DATE 
                    };
                } else {
                    acc[`${i+1}`] = null;
                }
            } else {
                acc[`${i+1}`] = data[key];
            }
            return acc;
        }, {});
            
        bindVars.risk_id = risk_id;  // URL 파라미터의 risk_id 사용
        
        console.log('Binds:', binds);
        console.log('BindValues:', bindVars);

        const result = await connection.execute(
            `UPDATE ${table}
            SET ${binds}
            WHERE RISK_ID = :risk_id`,  // RISK_ID로 조건 변경
            bindVars,
            { autoCommit: true }
        );

        console.log(result);

        res.status(200).json({ 
            success: true,
            message: '데이터가 성공적으로 업데이트되었습니다.',
            rowsAffected: result.rowsAffected
        });


        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
})

module.exports = router;