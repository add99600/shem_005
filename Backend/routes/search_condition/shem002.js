const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDBConnection } = require('../../models/dbconnect/db_connect');
const oracledb = require('oracledb');

// 날짜 폴더명 생성 함수
const getDateFolder = () => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
};

// 안전한 파일명 생성 함수
const sanitizeFileName = (originalname) => {
    try {
        // 파일명과 확장자 분리
        const ext = path.extname(originalname);
        const basename = path.basename(originalname, ext);
        
        // 파일명이 비어있거나 모두 특수문자인 경우 기본값 사용
        if (!basename.trim() || basename.replace(/[^\w\s가-힣]/g, '').trim() === '') {
            return `file_${Date.now()}${ext}`;
        }
        
        // 한글과 영숫자만 허용하고 나머지는 언더스코어로 변경
        const sanitized = basename
            .replace(/[^\w\s가-힣]/g, '_')  // 특수문자를 언더스코어로 변경
            .replace(/\s+/g, '_')           // 공백을 언더스코어로 변경
            .replace(/_+/g, '_')            // 중복 언더스코어 제거
            .trim();
        
        return sanitized + ext;
    } catch (error) {
        console.error('Filename sanitization error:', error);
        return `file_${Date.now()}${path.extname(originalname)}`;
    }
};

// multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const menu_id = req.params.id;
        const dateFolder = getDateFolder();
        const fieldFolder = file.fieldname;
        
        const uploadPath = path.join(__dirname, '../../uploads', menu_id, dateFolder, fieldFolder);
        
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        console.log('Upload path:', uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        try {
            // 원본 파일명 디코딩 및 정리
            const decodedName = Buffer.from(file.originalname, 'binary').toString('utf8');
            const safeOriginalName = sanitizeFileName(decodedName);
            const timestamp = Date.now();
            const ext = path.extname(safeOriginalName);
            const basename = path.basename(safeOriginalName, ext);
            
            const finalBasename = basename || 'file';
            const filename = `${file.originalname}_${timestamp}${ext}`;
            console.log('저장할 파일명', filename);
            
            console.log('File processing:', {
                original: file.originalname,
                decoded: decodedName,
                sanitized: safeOriginalName,
                final: filename
            });
            
            cb(null, filename);
        } catch (error) {
            console.error('Filename processing error:', error);
            const timestamp = Date.now();
            cb(null, `file_${timestamp}${path.extname(file.originalname)}`);
        }
    }
});

// multer 미들웨어
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        try {
            // 원본 파일명 디코딩
            const decodedName = Buffer.from(file.originalname, 'binary').toString('utf8');
            file.originalname = decodedName;  // 디코딩된 파일명 저장
            
            console.log('File filter:', {
                fieldname: file.fieldname,
                originalname: file.originalname
            });
            
            cb(null, true);
        } catch (error) {
            console.error('File filter error:', error);
            cb(null, false);
        }
    }
});


// 파일 필드 설정
const fileFields = [
    { name: 'FILE1', maxCount: 10 },
    { name: 'FILE2', maxCount: 10 },
    { name: 'FILE3', maxCount: 10 },
    { name: 'FILE4', maxCount: 10 }
];

// shem002 파일 업로드 후 json 파일 저장
router.post('/api/insert/file/json/:id', upload.fields(fileFields), async (req, res) => {
    let connection;
    let hasResponded = false;
    const uploadedFiles = [];

    try {
        connection = await getDBConnection();
        const menu_id = req.params.id;
        const files = req.files;
        const dateFolder = getDateFolder();
        
        // 파일 정보 처리
        const processedData = { ...req.body };

        console.log('processedData:', processedData);
        
        // 각 파일 필드 처리
        ['FILE1', 'FILE2', 'FILE3', 'FILE4'].forEach(fieldName => {
            if (files && files[fieldName] && files[fieldName].length > 0) {
                const fileInfo = files[fieldName].map(file => {
                    const relativePath = path.join(
                        menu_id,
                        dateFolder,
                        fieldName,
                        file.filename
                    ).replace(/\\/g, '/');
                    
                    uploadedFiles.push(file.path);
                    return {
                        fieldName: fieldName,
                        filename: file.originalname,
                        savedAs: file.filename,
                        path: relativePath,
                        fullPath: path.join('uploads', relativePath),
                        size: file.size,
                        mimetype: file.mimetype,
                        uploadedAt: new Date().toISOString()
                    };
                });
                processedData[fieldName] = JSON.stringify(fileInfo);
            } else {
                processedData[fieldName] = '[]';
            }
        });

        // 메뉴 id가 shem002인 데이터 조회 
        const result = await connection.execute(`
            SELECT sql1, sql2, sql3, sql4, sql5
            FROM REGIST_SQL_MANAGE
            WHERE menu_id = :menu_id
        `, [menu_id]);
        
        console.log('result:', result);
        
        const idArray = result.rows[0];
        const processValue = (value) => {
            if (value === null || value === undefined) {
                return 'NULL';
            }
            
            if (value === 'CURRENT_TIMESTAMP') {
                return value;
            }
            
            if (typeof value === 'object') {
                return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
            }
            
            if (typeof value === 'string') {
                // 날짜 형식 확인
                if (value.match(/^\d{4}\/\d{2}\/\d{2}\s\d{2}:\d{2}:\d{2}$/)) {
                    return `TO_DATE('${value}', 'YYYY/MM/DD HH24:MI:SS')`;
                }
                return `'${value.replace(/'/g, "''")}'`;
            }
            
            // 숫자인 경우 따옴표 없이 반환
            if (typeof value === 'number') {
                return value;
            }
            
            return `'${String(value).replace(/'/g, "''")}'`;
        };
        
        for (const id of idArray) {
            if (!id) continue;

            console.log('id:', idArray);
        
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
        
            // SQL에서 컬럼 이름들을 추출
            const columnMatch = insertSql.match(/\((.*?)\)/);
            if (!columnMatch) continue;
            
            const columns = columnMatch[1].split(',').map(col => col.trim());
            
            // ISRT_DT와 UPDT_DT가 없다면 추가
            if (!columns.includes('ISRT_DT')) {
                columns.push('ISRT_DT');
            }
            if (!columns.includes('UPDT_DT')) {
                columns.push('UPDT_DT');
            }
            
            // SQL의 컬럼 순서에 맞게 값 배열 생성
            const values = columns.map(column => {
                if (column === 'ISRT_DT' || column === 'UPDT_DT') {
                    return `TO_DATE(TO_CHAR(SYSDATE, 'YYYY/MM/DD HH24:MI:SS'), 'YYYY/MM/DD HH24:MI:SS')`;
                }
                const value = processedData[column];
                return processValue(value);
            });
            
            // SQL 템플릿 수정
            insertSql = insertSql.replace(/\((.*?)\)/, `(${columns.join(', ')})`);
            insertSql = insertSql.replace('#values#', values.join(', '));
            
            console.log('Executing SQL:', insertSql);
            
            const queryResult = await connection.execute(insertSql, [], { autoCommit: true });
            console.log(`Insert result for ${id}:`, queryResult);
        }

        if (!hasResponded) {
            hasResponded = true;
            return res.status(200).json({ 
                success: true, 
                message: '데이터가 성공적으로 저장되었습니다.',
                data: processedData
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

// shem002 업데이트 
router.put('/api/update/file/json/:id', upload.fields(fileFields), async (req, res) => {
    let connection;
    let hasResponded = false;
    const uploadedFiles = [];

    try {
        connection = await getDBConnection();
        const menu_id = req.params.id;
        const files = req.files;
        const dateFolder = getDateFolder();
        
        // 파일 정보 처리
        const processedData = { ...req.body };

        // 각 파일 필드 처리
        ['FILE1', 'FILE2', 'FILE3', 'FILE4'].forEach(fieldName => {
            if (files && files[fieldName] && files[fieldName].length > 0) {
                const fileInfo = files[fieldName].map(file => {
                    const relativePath = path.join(
                        menu_id,
                        dateFolder,
                        fieldName,
                        file.filename
                    ).replace(/\\/g, '/');
                    
                    uploadedFiles.push(file.path);
                    return {
                        fieldName: fieldName,
                        filename: file.originalname,
                        savedAs: file.filename,
                        path: relativePath,
                        fullPath: path.join('uploads', relativePath),
                        size: file.size,
                        mimetype: file.mimetype,
                        uploadedAt: new Date().toISOString()
                    };
                });
                processedData[fieldName] = JSON.stringify(fileInfo);
            } else {
                processedData[fieldName] = '[]';
            }
        });

        // 메뉴 id가 shem002인 데이터 조회 
        const result = await connection.execute(`
            SELECT sql1, sql2, sql3, sql4, sql5
            FROM REGIST_SQL_MANAGE
            WHERE menu_id = :menu_id
        `, [menu_id]);
        
        const idArray = result.rows[0];

        const processValue = (value) => {
            if (value === null || value === undefined) {
                return 'NULL';
            }
            
            if (typeof value === 'object') {
                if (value.iLob) {
                    return 'NULL';
                }
                return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
            }
            
            if (typeof value === 'string') {
                if (value.match(/^\d{4}[-/]\d{2}[-/]\d{2}.*$/)) {
                    return `TO_DATE('${value}', 'YYYY/MM/DD HH24:MI:SS')`;
                }
                return `'${value.replace(/'/g, "''")}'`;
            }
            
            if (typeof value === 'number') {
                return value;
            }
            
            return `'${String(value).replace(/'/g, "''")}'`;
        };
        

        for (const id of idArray) {
            if (!id) continue;

            const result1 = await connection.execute(`
                SELECT update_sql
                FROM regist_sql
                WHERE regist_id = :id
            `, [id]);
            
            if (!result1.rows || result1.rows.length === 0) continue;

            const clob = result1.rows[0][0];
            let updateSql = await new Promise((resolve, reject) => {
                let sql = '';
                clob.setEncoding('utf8');
                clob.on('data', chunk => sql += chunk);
                clob.on('end', () => resolve(sql));
                clob.on('error', err => reject(err));
            });

            console.log('updateSql:', updateSql);

            // SQL에서 컬럼 이름 추출
            const columnMatch = updateSql.match(/\((.*?)\)/);
            if (!columnMatch) continue;
            
            // SQL의 컬럼 순서대로 값 매핑
            const columns = columnMatch[1].split(',').map(col => col.trim());
            const values = columns.map(column => {

                if (column === 'PRCOESS') {
                    return 'NULL';
                }
                const value = processedData[column];
                return processValue(value);
            }).join(', ');
            

            updateSql = updateSql
                .replace('#values#', `SELECT ${values} FROM DUAL`)
                + ` WHERE ID = ${processedData.ID}`;

            console.log('Executing SQL:', updateSql);
            
            const queryResult = await connection.execute(updateSql, [], { autoCommit: true });
            console.log(`Update result for ${id}:`, queryResult);
        }

        if (!hasResponded) {
            hasResponded = true;
            return res.status(200).json({ 
                success: true, 
                message: '데이터가 성공적으로 수정되었습니다.',
                data: processedData
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


// 서버 측 코드 수정
router.get('/api/download/:filePath(*)', async (req, res) => {
    try {
      const decodedPath = decodeURIComponent(req.params.filePath);
      const filePath = path.join(__dirname, '../../uploads', decodedPath);
      
      console.log('요청된 파일 경로:', filePath);
  
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ 
          success: false, 
          message: '파일이 서버에 존재하지 않습니다.' 
        });
      }
  
      // 파일명에서 타임스탬프 제거하고 원본 파일명 추출
      const filename = path.basename(filePath);
      const originalFilename = filename.split('_')[0];  // 타임스탬프 이전의 원본 파일명
  
      console.log('다운로드할 원본 파일명:', originalFilename);
  
      // Content-Disposition 헤더 설정
      res.setHeader(
        'Content-Disposition', 
        `attachment; filename*=UTF-8''${encodeURIComponent(originalFilename)}`
      );
  
      // 파일 스트림으로 전송
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
  
      fileStream.on('error', (err) => {
        console.error('File stream error:', err);
        if (!res.headersSent) {
          res.status(500).json({ 
            success: false, 
            message: '파일 다운로드 중 오류가 발생했습니다.' 
          });
        }
      });
  
    } catch (err) {
      console.error('Download error:', err);
      if (!res.headersSent) {
        res.status(500).json({ 
          success: false, 
          message: '파일 다운로드 중 오류가 발생했습니다.' 
        });
      }
    }
  });

module.exports = router;