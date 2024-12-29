const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../models/dbconnect/db_connect');
const oracledb = require('oracledb');

// GRID검색조건
router.get('/api/search/condition', async (req, res) => {
    let connection;
    try {
      connection = await getDBConnection();

      const { column, menu_id, grid_ids, combinedData } = req.query;

      console.log(grid_ids);
  
      let data = combinedData
      
      let check_sql = `
        SELECT ${column}
        FROM MENU_REGIST_MANAGE
        WHERE menu_id = :menu_id
      `
      const check_result = await connection.execute(check_sql, [ menu_id ], { autoCommit: true })

      let sql = `
        select sql_detail
        from check_sql_manage
        where id = :id`

      // 동적으로 SQL_ID 받기
      const result = await connection.execute(sql, [ check_result.rows[0][0] ], { autoCommit: true });

      // Lob 객체를 문자열로 변환
      const clob = result.rows[0][0];
      let clobData = '';
    
      if (clob) {
        clob.setEncoding('utf8'); // 인코딩 설정
        clobData = await new Promise((resolve, reject) => {
          let data = '';
          clob.on('data', (chunk) => {
            data += chunk;
          });
          clob.on('end', () => {
            resolve(data);
          });
          clob.on('error', (err) => {
            reject(err);
          });
        });
        console.log('CLOB 데이터:', clobData);
  
        // 정규 표현식을 사용하여 clobData 내의 변수를 치환
        clobData = clobData.replace(/#(\w+)#/g, (match, p1) => {
            return data[p1] || match;
        });
        
        console.log('치환된 CLOB 데이터:', clobData);
        
        // 치환된 SQL을 실행
        const queryResult = await connection.execute(clobData);

        // 각 행을 객체로 변환
        const query_data = queryResult.rows.map(row => {
            let obj = {};
            row.forEach((item, index) => {
                obj[queryResult.metaData[index].name] = item;
            });
            return obj;
        });
        
        res.status(200).json({ success: true, data: query_data, grid: grid_ids });

    } else {
      res.status(400).json({ success: false, message: 'CLOB 데이터를 찾을 수 없습니다.' });
    }
    
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


// 저장
router.post('/api/insert/:id', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    await connection.execute(`ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY/MM/DD HH24:MI:SS'`);


    // 등록메뉴관리의 menu_id 
    const menu_id = req.params.id
    

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

    console.log('data',data)

    // 메뉴 id를 기준으로 sql 쿼리 조회
    let sql = `
    select sql1, sql2, sql3, sql4, sql5
    from REGIST_SQL_MANAGE
    where menu_id = :menu_id
    `

    // 동적으로 SQL_ID 받기
    const result = await connection.execute(sql, [ menu_id ], { autoCommit: true });
    
    const idArray = result.rows[0];

    // data 객체의 키와 값을 처리하는 함수
    const processValue = (value) => {
      if (value === null) {
        return 'NULL';
      } else if (value === 'CURRENT_TIMESTAMP') {
        return value;
      } else if (typeof value === 'object') {
        // 객체나 배열을 JSON 문자열로 변환
        return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
      } else if (typeof value === 'string' && value.includes('TIMESTAMP')) {
        return value;
      } else {
        return `'${String(value).replace(/'/g, "''")}'`;
      }
    };

    // INSERT_SQL문을 id개수 만큼 실행
    for (const id of idArray) {
      if (id) {
        let sql1 = `
          SELECT insert_sql
          FROM regist_sql
          WHERE regist_id = :id
        `;
    
        try {
          const result1 = await connection.execute(sql1, [id]);
          
          // CLOB 데이터를 문자열로 변환
          const clob = result1.rows[0][0];
          const clobData = await new Promise((resolve, reject) => {
            let data = '';
            clob.setEncoding('utf8');
            clob.on('data', chunk => data += chunk);
            clob.on('end', () => resolve(data));
            clob.on('error', err => reject(err));
          });
    
          console.log(`CLOB 데이터 for ${id}:`, clobData);
    
          // data 객체의 키와 값을 추출하고 처리
          let keysArray = Object.keys(data);
          let valuesArray = Object.values(data).map(processValue);
    
          // ISRT_DT, UPDT_DT가 없다면 추가
          if (!keysArray.includes('ISRT_DT')) {
            keysArray.push('ISRT_DT');
            valuesArray.push('CURRENT_TIMESTAMP');
          }
          if (!keysArray.includes('UPDT_DT')) {
            keysArray.push('UPDT_DT');
            valuesArray.push('CURRENT_TIMESTAMP');
          }
    
          // data 객체의 키와 값을 조합
          const keys = keysArray.join(', ');
          const values = valuesArray.join(', ');
    
          // clobData 내의 #keys#와 #values#를 치환
          const replacedClobData = clobData
            .replace('#keys#', keys)
            .replace('#values#', values);
    
          console.log(`치환된 CLOB 데이터 for ${id}:`, replacedClobData);
    
          // 치환된 SQL을 실행
          const queryResult = await connection.execute(
            replacedClobData, 
            [],
            { autoCommit: true }
          );
          
          console.log('쿼리 결과:', queryResult);
    
        } catch (error) {
          console.error(`Error processing id ${id}:`, error);
          res.status(500).json({ success: false, message: `Error processing id ${id}` });
        }
      }
    }

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

// 글 작성정보 불러오기
router.get('/api/load/:table/:id', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    const { table, id } = req.params;  // URL 파라미터 추출

    let sql = `
      select *
      from ${table}
      where id = :id
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
        'shem002_new': ['CAS_INFO','FILE1','FILE2','FILE3','FILE4'],
        'shem007_new': ['TOOLS'],
        'shem014_new': ['CHECK_RESULT', 'CHECK_LIST'],
        'shem020_new': ['CHECK_LIST'],
        'she_notice_new': ['CONTENTS']
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

// 글 수정
router.put('/api/update/:table', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    await connection.execute(
      `ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY/MM/DD HH24:MI:SS'`
    );

    const { table } = req.params;
    const data = req.body;
    
    // ID를 배열에서 제거
    const keys = Object.keys(data)
      .filter(key => key !== 'ID' && key !== 'DELETE_DT');
    
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
      } else if (key.endsWith('_DT')) {
        acc[`${i+1}`] = { 
          val: new Date(data[key]), 
          type: oracledb.DATE 
        };
      } else {
        acc[`${i+1}`] = data[key];
      }
      return acc;
    }, {});
        
    bindVars.id = data.ID;
    
    console.log('Binds:', binds);
    console.log('BindValues:', bindVars);

    const result = await connection.execute(
      `UPDATE ${table}
       SET ${binds}
       WHERE ID = :id`,
      bindVars,
      { autoCommit: true }
    );

    console.log(result)


    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
})

module.exports = router;