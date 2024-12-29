const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../models/dbconnect/db_connect');
const iconv = require('iconv-lite');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 날짜 폴더명 생성 함수
const getDateFolder = () => {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      // TOP_MENU 값 가져오기
      const data = JSON.parse(req.body.data);
      console.log('data:', data);
      const topMenu = data.TOP_MENU;
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

router.put('/api/file/data/update', upload.single('file'), async (req, res) => {
  let connection;
  try {
      connection = await getDBConnection();
  
      const data = JSON.parse(req.body.data);
      const id = req.body.id;
      const file = req.file;

      // 기존 파일 정보 조회
      const oldFileResult = await connection.execute(
        `SELECT NAME, PATH, TOP_MENU FROM file_info WHERE id = :id`,
        [id]
      );

      if (!oldFileResult.rows || oldFileResult.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: '기존 파일 정보를 찾을 수 없습니다.' 
        });
      }

      const oldFileName = oldFileResult.rows[0][0];
      const oldFilePath = oldFileResult.rows[0][1];
      const topMenu = oldFileResult.rows[0][2];

      console.log('기존 파일 정보:', {
        oldFileName,
        oldFilePath,
        topMenu
      });

      // 날짜 폴더명 생성
      const dateFolder = getDateFolder();
      const targetDir = path.join(__dirname, '../../uploads', topMenu, dateFolder);
      
      // 대상 디렉토리 생성
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log('디렉토리 생성됨:', targetDir);
      }

      if (file) {
        // 새 파일이 업로드된 경우
        console.log('새 파일 업로드 감지:', file.originalname);

        // 기존 파일 삭제
        if (oldFilePath) {
          const fullOldPath = path.join(__dirname, '../../', oldFilePath);
          try {
            if (fs.existsSync(fullOldPath)) {
              await fs.promises.unlink(fullOldPath);
              console.log('기존 파일 삭제됨:', fullOldPath);
            }
          } catch (error) {
            console.error('기존 파일 삭제 실패:', error);
          }
        }

        // 새 파일 경로 설정
        const newPath = `uploads/${topMenu}/${dateFolder}/${file.filename}`;
        const fullNewPath = path.join(__dirname, '../../', newPath);
        
        // 임시 파일을 새 위치로 이동
        await fs.promises.rename(file.path, fullNewPath);
        console.log('새 파일 이동됨:', fullNewPath);
        
        data.PATH = newPath;
        data.NAME = file.filename;
      } else if (data.NAME && data.NAME !== oldFileName) {
        // 파일명만 변경된 경우
        console.log('파일명 변경 감지:', {
          from: oldFileName,
          to: data.NAME
        });

        if (oldFilePath) {
          const fullOldPath = path.join(__dirname, '../../', oldFilePath);
          const newPath = `uploads/${topMenu}/${dateFolder}/${data.NAME}`;
          const fullNewPath = path.join(__dirname, '../../', newPath);

          try {
            // 기존 파일이 존재하는지 확인
            if (fs.existsSync(fullOldPath)) {
              // 새 이름으로 파일 이동
              await fs.promises.rename(fullOldPath, fullNewPath);
              console.log('파일 이름 변경됨:', {
                from: fullOldPath,
                to: fullNewPath
              });
              
              data.PATH = newPath;
            } else {
              console.error('기존 파일을 찾을 수 없음:', fullOldPath);
              throw new Error('기존 파일을 찾을 수 없습니다.');
            }
          } catch (error) {
            console.error('파일 이름 변경 실패:', error);
            throw error;
          }
        } else {
          console.error('기존 파일 경로가 없음');
          throw new Error('기존 파일 경로가 없습니다.');
        }
      }

      if (data.INSERT_TIME) {
        // ISO 문자열을 Oracle 날짜 형식으로 변환
        const date = new Date(data.INSERT_TIME);
        data.INSERT_TIME = date.toISOString()
            .replace('T', ' ')
            .split('.')[0];  // 'YYYY-MM-DD HH:mm:ss' 형식
    }

      // DB 업데이트
      const keys = Object.keys(data).filter(key => key !== 'ID');
      const binds = keys.map((key, i) => `${key} = :${i+1}`).join(', ');
      const bindVars = keys.reduce((acc, key, i) => {
        acc[`${i+1}`] = data[key];
        return acc;
      }, {});
  
      console.log('DB 업데이트 정보:', {
        binds,
        bindVars
      });
  
      const result = await connection.execute(
        `UPDATE file_info
         SET ${binds}
         WHERE id = :id`, 
        { ...bindVars, id }, 
        { autoCommit: true }
      );
  
      console.log('Update result:', result);

      res.status(200).json({ 
        success: true,
        message: '파일과 정보가 업데이트되었습니다',
        fileName: data.NAME,
        path: data.PATH,
        fileChanged: !!file || data.NAME !== oldFileName
      });

  } catch (error) {
      console.error('Error:', error);
      if (req.file && req.file.path) {
        try {
          await fs.promises.unlink(req.file.path);
          console.log('에러로 인한 임시 파일 삭제:', req.file.path);
        } catch (unlinkError) {
          console.error('임시 파일 삭제 실패:', unlinkError);
        }
      }
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
  } finally {
    if (connection) {
      try {
          await connection.close();
      } catch (err) {
          console.error('DB 연결 종료 실패:', err);
      }
    }
  }
});

router.delete('/api/file/data/delete', async (req, res) => {
    let connection;
    try {
        connection = await getDBConnection();

        const data = JSON.parse(req.query.data);

        console.log(data.NAME)

        const result = await connection.execute(`
        DELETE FROM file_info
        WHERE name = :name`, 
        [data.NAME], { autoCommit: true });

        console.log(result)

        const filePath = path.join(__dirname, '../../uploads', data.NAME);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('파일 삭제 중 오류 발생:', err);
            return res.status(500).json({ message: '파일 삭제 중 오류 발생' });
          } 
          console.log('파일 삭제 완료:', data.NAME)
          res.status(200).json({ success: true });
        })

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

module.exports = router;
