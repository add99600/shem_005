const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../models/dbconnect/db_connect');
const oracledb = require('oracledb');


router.post('/api/:id/insert', async (req, res) => {
    let connection;
    let hasResponded = false;  // 응답 전송 여부를 추적

    try {
      connection = await getDBConnection();

      // 날짜 형식 설정
      await connection.execute(
        `ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY/MM/DD HH24:MI:SS'`
      );
  
      let data = req.body;
      const menu_id = req.params.id

      console.log('Received data:', JSON.stringify(data, null, 2));

      // 메뉴 id가 shem007인 데이터 조회 
      const result = await connection.execute(`
        SELECT sql1, sql2, sql3, sql4, sql5
        FROM REGIST_SQL_MANAGE
        WHERE menu_id = :menu_id
      `, [ menu_id ]);
      
      const idArray = result.rows[0];
      const processedResults = [];
      
      for (const id of idArray) {
        if (!id) continue;

        const result1 = await connection.execute(`
          SELECT insert_sql
          FROM regist_sql
          WHERE regist_id = :id
        `, [id]);
        
        if (!result1.rows || result1.rows.length === 0) continue;

        const clob = result1.rows[0][0];
        let insertSql = await new Promise((resolve, reject) => {
          let sql = '';
          clob.setEncoding('utf8');
          clob.on('data', chunk => sql += chunk);
          clob.on('end', () => resolve(sql));
          clob.on('error', err => reject(err));
        });

        // 현재 시간 생성
        const now = new Date();
        const formattedDate = now.toISOString()
          .replace('T', ' ')
          .replace(/\.\d{3}Z$/, '');

        // 데이터 처리
        const processedData = {};
        Object.entries(data).forEach(([key, value]) => {
          if (value === null) {
            processedData[key] = null;
          } else if (typeof value === 'object') {
            processedData[key] = JSON.stringify(value);
          } else {
            processedData[key] = value;
          }
        });

        // 필수 필드 추가
        if (!processedData.ISRT_DT) processedData.ISRT_DT = formattedDate;
        if (!processedData.UPDT_DT) processedData.UPDT_DT = formattedDate;
        if (!processedData.ISRT_ID) processedData.ISRT_ID = req.body.userId || '1240422';
        if (!processedData.UPDT_ID) processedData.UPDT_ID = req.body.userId || '1240422';
        if (!processedData.USER_NAME) processedData.USER_NAME = req.body.userName || '1240422';
        if (!processedData.STATUS) processedData.STATUS = req.body.status || '01';

        // 키와 값 배열 생성
        const keys = Object.keys(processedData).join(', ');
        const values = Object.values(processedData).map(value => {
          if (value === null) return 'NULL';
          if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
          return `'${value}'`;
        }).join(', ');

        // SQL 템플릿의 플레이스홀더 교체
        insertSql = insertSql.replace('#keys#', keys).replace('#values#', values);
        
        console.log(`Final SQL for ${id}:`, insertSql);
        
        // 실제 INSERT 실행
        const queryResult = await connection.execute(insertSql, [], { autoCommit: true });
        console.log(`Insert result for ${id}:`, queryResult);
      }

      if (!hasResponded) {
        hasResponded = true;
        return res.status(200).json({ 
          success: true, 
          message: '데이터가 성공적으로 저장되었습니다.' 
        });
      }
    
    } catch (err) {
      console.error('Error:', err);
      if (!hasResponded) {
        hasResponded = true;
        return res.status(500).json({ 
          success: false, 
          message: err.message || '데이터 저장 중 오류가 발생했습니다.' 
        });
      }
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
});


router.get('/api/shem007_new/:id/load', async (req, res) => {
    let connection;
    try {
      connection = await getDBConnection();
  
      const { id } = req.params;  // URL 파라미터 추출
  
      let sql = `
        select *
        from ${shem007_new}
        where id = :id
      `
      const result = await connection.execute(sql, [ id ]);
  
      // 각 행을 객체로 변환
      const data = result.rows.map(row => {
        let obj = {};
        row.forEach((item, index) => {
            obj[result.metaData[index].name] = item;
        });
        return obj;
      });
  
      res.status(200).json({ success: true, data: data });
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });
  

module.exports = router;