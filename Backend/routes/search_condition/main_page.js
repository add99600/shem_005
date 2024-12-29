const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../models/dbconnect/db_connect');
const oracledb = require('oracledb');

// 메인화면 게시판 조회
router.get('/api/board/list/main', async (req, res) => {
    let connection;
    try {
      connection = await getDBConnection();
      const { board1, board2, board3 } = req.query;
  
      console.log('요청된 테이블:', board1, board2, board3);
  
      // 각 테이블별 최신 5개 데이터 조회 쿼리
      const query = `
      SELECT * FROM (
        SELECT a.*, 'board1' as board_type FROM (
          SELECT CAST(SUBJECT AS VARCHAR2(4000)) as TITLE, ISRT_DT FROM ${board1}
          ORDER BY ISRT_DT DESC
          FETCH FIRST 5 ROWS ONLY
        ) a
        UNION ALL
        SELECT a.*, 'board2' as board_type FROM (
          SELECT CAST(ITEM_NM AS VARCHAR2(4000)) as TITLE, ISRT_DT FROM ${board2}
          ORDER BY ISRT_DT DESC
          FETCH FIRST 5 ROWS ONLY
        ) a
        UNION ALL
        SELECT a.*, 'board3' as board_type FROM (
          SELECT CAST(TITLE AS VARCHAR2(4000)) as TITLE, ISRT_DT FROM ${board3}
          ORDER BY ISRT_DT DESC
          FETCH FIRST 5 ROWS ONLY
        ) a
      )
      ORDER BY board_type, ISRT_DT DESC
    `;
  
      // 각 쿼리 실행
      const result = await connection.execute(query);

      console.log(result);
  
      res.json({
        success: true,
        data: result.rows
      });
  
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({
        success: false,
        message: err.message
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('DB connection close error:', err);
        }
      }
    }
  });
  
module.exports = router;