const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDBConnection } = require('../../models/dbconnect/db_connect');
const iconv = require('iconv-lite');
const oracledb = require('oracledb');

// 날짜 폴더명 생성 함수
const getDateFolder = () => {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      let topMenu;
      
      // 두 가지 경우 모두 처리
      if (req.body.data) {
        try {
          // JSON 형식으로 온 경우
          topMenu = JSON.parse(req.body.data).TOP_MENU;
        } catch {
          // 일반 필드로 온 경우
          topMenu = req.body.TOP_MENU;
        }
      } else {
        // 둘 다 없는 경우 기본값 설정
        topMenu = 'SHEM006_NEW';
      }

      const dateFolder = getDateFolder();
      
      // uploads/TOP_MENU/날짜 형식의 경로 생성
      const uploadPath = path.join(__dirname, '../../uploads', topMenu, dateFolder);
      
      // 디렉토리가 없으면 생성
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log('업로드 디렉토리 생성:', uploadPath);
      }
      cb(null, uploadPath);
      
    } catch (error) {
      console.error('디렉토리 생성 중 오류:', error);
      cb(error);
    }
  },

  filename: function (req, file, cb) {
    const filenameBuffer = Buffer.from(file.originalname, 'binary');
    const originalFilename = iconv.decode(filenameBuffer, 'utf-8');
    
    const ext = originalFilename.split('.').pop();
    const nameWithoutExt = originalFilename.replace(`.${ext}`, '');
    
    const now = new Date();
    const timestamp = now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      '_' +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');
    
    const newFilename = `${nameWithoutExt}_${timestamp}.${ext}`;
    
    console.log('Uploaded file name:', newFilename);
    cb(null, newFilename);
  }
});

const upload = multer({ storage: storage });

router.post('/api/file/upload', upload.single('file'), async (req, res) => {
  let connection;
  try {
      connection = await getDBConnection();

      const parsedData = JSON.parse(req.body.data);
      let { TEXT_NAME, NUM, DESCRIPTION, TOP_MENU, NAME } = parsedData;

      // 날짜 폴더명 생성
      const dateFolder = getDateFolder();
      
      // 상대 경로 생성 (Windows 경로 구분자를 Unix 스타일로 변환)
      const relativePath = `uploads/${TOP_MENU}/${dateFolder}/${req.file.filename}`;
      console.log('생성된 상대 경로:', relativePath);

      const check_file_query = `
      SELECT COUNT(*) as cnt
      FROM file_info
      WHERE name = :name
      and top_menu = :top`;
      
      const check_file_result = await connection.execute(check_file_query, [ req.file.filename, TOP_MENU ]);
      
      if (check_file_result.rows[0][0] > 0) {
        return res.status(403).json({ message: '동일한 파일이 존재합니다.' });
      }

      const date = new Date();

      const insert_query = `
      INSERT INTO file_info 
      (name, path, insert_time, top_menu, description, num, text_name) 
      VALUES 
      (:name, :path, :insert_time, :top_menu, :description, :num, :text_name)`;

      const result = await connection.execute(
          insert_query,
          {
            name: NAME,
            path: relativePath,  // 수정된 경로
            insert_time: date,
            top_menu: TOP_MENU,
            description: DESCRIPTION,
            num: NUM,
            text_name: TEXT_NAME
          },
          { autoCommit: true }
      );
              
      console.log('Upload result:', result);
      console.log('Saved path:', relativePath);

      res.status(200).json({ 
        success: true,
        path: relativePath
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


// 여러 파일 업로드
router.post('/api/file/upload/multi', upload.fields([
  { name: 'FILE_1' },
  { name: 'FILE_2' },
  { name: 'FILE_3' },
  { name: 'FILE_4' },
  { name: 'FILE_5' },
  { name: 'FILE_6' },
  { name: 'FILE_7' },
  { name: 'FILE_8' }
]), async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    // 전송된 파일들과 폼 데이터
    const files = req.files;
    const { EQUIP_CD, EQUIP_NO } = req.body;

    console.log('Received files:', files);
    console.log('Received form data:', { EQUIP_CD, EQUIP_NO });

    const date = new Date();
    const userId = 'SYSTEM'; // 또는 실제 사용자 ID

    // 파일 정보 삽입
    const insert_query = `
    INSERT INTO SHEM006_NEW 
    (H_ID, EQUIP_CD, EQUIP_NO, 
     FILE_1, FILE_2, FILE_3, FILE_4, FILE_5, FILE_6, FILE_7, FILE_8,
     ISRT_ID, ISRT_DT, UPDT_ID, UPDT_DT) 
    VALUES 
    (:h_id, :equip_cd, :equip_no,
     :file_1, :file_2, :file_3, :file_4, :file_5, :file_6, :file_7, :file_8,
     :isrt_id, :isrt_dt, :updt_id, :updt_dt)`;

    // 바인드 변수 객체 생성
    const bindParams = {
      h_id: 1240422,
      equip_cd: EQUIP_CD,
      equip_no: EQUIP_NO,
      file_1: null,
      file_2: null,
      file_3: null,
      file_4: null,
      file_5: null,
      file_6: null,
      file_7: null,
      file_8: null,
      isrt_id: userId,
      isrt_dt: date,
      updt_id: userId,
      updt_dt: date     
    };

    // 파일 정보 설정
    if (files) {
      Object.entries(files).forEach(([key, fileArray]) => {
        if (fileArray && fileArray[0]) {
          const fileKey = key.toLowerCase();  // FILE_1 -> file_1
          bindParams[fileKey] = fileArray[0].filename;
          console.log(`Setting ${fileKey} to ${fileArray[0].filename}`);
        }
      });
    }

    console.log('Final bind params:', bindParams);

    // 데이터 삽입
    const result = await connection.execute(
      insert_query,
      bindParams,
      { 
        autoCommit: true,
        bindDefs: {
          h_id: { type: oracledb.NUMBER },
          equip_cd: { type: oracledb.NUMBER },
          equip_no: { type: oracledb.STRING, maxSize: 100 },
          file_1: { type: oracledb.STRING, maxSize: 500 },
          file_2: { type: oracledb.STRING, maxSize: 500 },
          file_3: { type: oracledb.STRING, maxSize: 500 },
          file_4: { type: oracledb.STRING, maxSize: 500 },
          file_5: { type: oracledb.STRING, maxSize: 500 },
          file_6: { type: oracledb.STRING, maxSize: 500 },
          file_7: { type: oracledb.STRING, maxSize: 500 },
          file_8: { type: oracledb.STRING, maxSize: 500 },
          isrt_id: { type: oracledb.STRING, maxSize: 100 },
          isrt_dt: { type: oracledb.DATE },
          updt_id: { type: oracledb.STRING, maxSize: 100 },
          updt_dt: { type: oracledb.DATE }
        }
      }
    );

    console.log('Insert result:', result);

    res.status(200).json({ 
      success: true,
      message: '장비 정보가 성공적으로 등록되었습니다.'
    });

  } catch (err) {
    console.error('Error in file upload:', err);
    res.status(500).json({ 
      success: false,
      message: '파일 업로드 중 오류가 발생했습니다.',
      error: err.message 
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing DB connection:', err);
      }
    }
  }
});

router.post('/api/file/list', async (req, res) => {
  let connection;
  try {
      connection = await getDBConnection();

      const { code } = req.body;

      const result = await connection.execute(`
        SELECT name, num, text_name
        FROM file_info
        where top_menu = :code`, [code]
      );

      // 각 행을 객체로 변환
      const data = result.rows.map(row => {
        let obj = {};
        row.forEach((item, index) => {
            obj[result.metaData[index].name] = item;
        });
        return obj;
      });

      const file_list = result.rows.map(row => row[0]);

      res.status(200).json({ success: true , data: file_list });

  } catch (err) {
      console.error(err);
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

// 파일 다운로드
router.get('/api/download/:top_menu/:filename', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();
    const top_menu = req.params.top_menu;
    const filename = req.params.filename;

    console.log('요청된 파일명:', top_menu, filename);

    const query = `
      SELECT path
      FROM file_info
      WHERE name = :filename
      and top_menu = :top_menu
    `;
    
    const result = await connection.execute(query, [filename, top_menu]);

    console.log('쿼리 결과:', result.rows);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: '파일을 찾을 수 없습니다.' 
      });
    }

    const filePath = path.join(__dirname, '../../', result.rows[0][0]);
    
    // 파일 존재 여부 확인
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        message: '파일이 서버에 존재하지 않습니다.' 
      });
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('File download failed:', err);
        res.status(500).json({ 
          success: false, 
          message: '파일 다운로드에 실패했습니다.' 
        });
      }
    });

  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ 
      success: false, 
      message: '파일 다운로드 중 오류가 발생했습니다.' 
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

router.get('/api/file/top/menu', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    const result = await connection.execute(`
      SELECT DISTINCT top_menu
      FROM file_info
      where top_menu is not null`
    );

    let result_list = result.rows.map(item => item[0]);

    res.status(200).json({ success: true , data: result_list });
  } catch (err) {
      console.error(err);
  }
});

router.get('/api/file/list/all', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    const result = await connection.execute(`
      SELECT *
      FROM file_info`
    )

    // 각 행을 객체로 변환
    const data = result.rows.map(row => {
      let obj = {};
      row.forEach((item, index) => {
          obj[result.metaData[index].name] = item;
      });
      return obj;
    });

    res.status(200).json({ success: true , data: data });
  } catch (err) {
      console.error(err);
  }
});


router.get('/api/file/list/:menu', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    const menu = req.params.menu

    const result = await connection.execute(`
      SELECT *
      FROM file_info
      WHERE top_menu = :menu`, [ menu ]
    )

    // 각 행을 객체로 변환
    const data = result.rows.map(row => {
      let obj = {};
      row.forEach((item, index) => {
          obj[result.metaData[index].name] = item;
      });
      return obj;
    });

    res.status(200).json({ success: true , data: data});

  } catch (err) {
      console.error(err);
  }
});


// 이미지 파일 불러오기
router.get('/api/images/loading/:top_menu', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();
    const top_menu = req.params.top_menu;

    console.log('요청된 TOP_MENU:', top_menu);

    const query = `
      SELECT *
      FROM file_info
      WHERE top_menu = :top_menu
    `;
    
    const result = await connection.execute(query, [top_menu]);

    console.log('쿼리 결과:', result.rows);
    
    // 결과를 객체 배열로 변환
    const images = result.rows.map(row => ({
      NAME: row[0],
      PATH: row[1],
      INSERT_TIME: row[2],
      TOP_MENU: row[3],
      DESCRIPTION: row[4],
      NUM: row[5],
      TEXT_NAME: row[6],
      ID: row[7]
    }));

    res.json({ 
      success: true,
      data: images
    });

  } catch (err) {
    console.error('Image loading error:', err);
    res.status(500).json({ 
      success: false, 
      message: '이미지 로딩 중 오류가 발생했습니다.' 
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

// 이미지 파일 제공을 위한 새로운 엔드포인트
router.get('/api/images/view/:top_menu/:filename', async (req, res) => {
  try {
    const { top_menu, filename } = req.params;
    
    // DB에서 파일 경로 조회
    const connection = await getDBConnection();
    const query = `
      SELECT path
      FROM file_info
      WHERE name = :filename
      AND top_menu = :top_menu
    `;
    
    const result = await connection.execute(query, [filename, top_menu]);
    
    if (result.rows.length === 0) {
      return res.status(404).send('File not found');
    }
    
    // 실제 파일 경로
    const filePath = path.join(__dirname, '../../', result.rows[0][0]);
    
    // 파일 존재 확인
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }
    
    // 파일 확장자에 따른 Content-Type 설정
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    
    res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
    
    // 파일 스트림 전송
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
