const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDBConnection } = require('../../models/dbconnect/db_connect');
const iconv = require('iconv-lite');

// 날짜 폴더명 생성 함수
const getDateFolder = () => {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
};

const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const menu_id = req.params.id;
        const dateFolder = getDateFolder();
        const uploadPath = path.join(__dirname, '../../uploads', menu_id, dateFolder);
        
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: function (req, file, cb) {
        const timestamp = Date.now();
        const originalname = file.originalname;
        const ext = path.extname(originalname);
        const basename = path.basename(originalname, ext);
        cb(null, `${basename}_${timestamp}${ext}`);
      }
    })
  });

  router.post('/api/insert/file/:id', upload.fields([
    { name: 'FILE1_file' },
    { name: 'FILE2_file' },
    { name: 'FILE3_file' },
    { name: 'FILE4_file' },
    { name: 'FILE5_file' }
  ]), async (req, res) => {
    let connection;
    try {
      // DB 연결
      connection = await getDBConnection();
      
      // 날짜 형식 설정
      await connection.execute(
        `ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD HH24:MI:SS'`
      );
  
      // JSON 데이터 파싱
      const data = JSON.parse(req.body.data);
      const files = req.files;
      const menu_id = req.params.id;
  
      // 파일 정보 업데이트
      for (let i = 1; i <= 5; i++) {
        const fileKey = `FILE${i}`;
        const fileData = files[`${fileKey}_file`]?.[0];
        
        if (fileData) {
          // 파일이 업로드된 경우, 파일명 업데이트
          data[fileKey] = fileData.filename;  // DB에는 파일명만 저장
        } else {
          data[fileKey] = null;
        }
      }
  
      // 현재 시간 생성
      const now = new Date();
      const formattedDate = now.toISOString()
        .replace('T', ' ')
        .replace(/\.\d{3}Z$/, '');
  
      // 필수 필드 추가
      const processedData = {
        ...data,
        ISRT_DT: formattedDate,
        UPDT_DT: formattedDate,
        ISRT_ID: '1240422',
        UPDT_ID: '1240422',
        USER_NAME: '1240422',
        STATUS: '01',
        EXECUTIVES_YN: 'N'
      };
  
      // SQL 조회
      const result = await connection.execute(`
        SELECT sql1, sql2, sql3, sql4, sql5
        FROM REGIST_SQL_MANAGE
        WHERE menu_id = :menu_id
      `, [menu_id]);
  
      const idArray = result.rows[0];
  
      // SQL 실행
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
  
        // 키와 값 배열 생성
        const keys = Object.keys(processedData).join(', ');
        const values = Object.values(processedData).map(value => {
          if (value === null) return 'NULL';
          if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
          return `'${value}'`;
        }).join(', ');
  
        insertSql = insertSql.replace('#keys#', keys).replace('#values#', values);
        
        console.log(`Final SQL for ${id}:`, insertSql);
        
        const result = await connection.execute(insertSql, [], { autoCommit: true });
        console.log('result:', result);
      }
  
      res.status(200).json({
        success: true,
        message: '데이터가 성공적으로 저장되었습니다.'
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
          console.error('Connection close error:', err);
        }
      }
    }
  });


// 파일 다운로드
router.get('/api/download/filelist/:table/:filename', async (req, res) => {
    let connection;
    try {
      connection = await getDBConnection();
      const table = req.params.table;
      const filename = req.params.filename;
      const menu_id = table.replace(/_new$/, '');  // ex) shem016_new -> shem016
  
      console.log('요청된 파일명:', table, filename);
  
      // FILE1~FILE5 컬럼에서 filename과 일치하는 레코드 찾기
      const query = `
        SELECT FILE1, FILE2, FILE3, FILE4, FILE5
        FROM ${table}
        WHERE FILE1 = :1 
           OR FILE2 = :1 
           OR FILE3 = :1 
           OR FILE4 = :1 
           OR FILE5 = :1
      `;
      
      const result = await connection.execute(query, [filename]);
      console.log('쿼리 결과:', result.rows);
      
      if (!result.rows || result.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: '파일을 찾을 수 없습니다.' 
        });
      }

      // 파일이 있는 컬럼 찾기
      const row = result.rows[0];
      let foundFile = null;
      
      Object.values(row).forEach(value => {
        if (value === filename) {
          foundFile = value;
        }
      });

      if (!foundFile) {
        return res.status(404).json({ 
          success: false, 
          message: '파일을 찾을 수 없습니다.' 
        });
      }

      // 날짜 폴더명 추출 (YYYYMMDD)
      const dateFolder = new Date().toISOString().slice(0, 10).replace(/-/g, '');

      // uploads/shem016/YYYYMMDD/filename 형식으로 파일 경로 생성
      const filePath = path.join(
        __dirname, 
        '../../uploads',
        menu_id,
        dateFolder,
        foundFile
      );
      
      console.log('파일 경로:', filePath);
      
      // 파일 존재 여부 확인
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ 
          success: false, 
          message: '파일이 서버에 존재하지 않습니다.',
          path: filePath 
        });
      }
  
      // 파일 다운로드
      res.download(filePath, filename, (err) => {
        if (err) {
          console.error('File download failed:', err);
          res.status(500).json({ 
            success: false, 
            message: '파일 다운로드에 실패했습니다.',
            error: err.message 
          });
        }
      });
  
    } catch (err) {
      console.error('Download error:', err);
      res.status(500).json({ 
        success: false, 
        message: '파일 다운로드 중 오류가 발생했습니다.',
        error: err.message 
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