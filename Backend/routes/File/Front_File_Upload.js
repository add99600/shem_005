const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getDBConnection } = require('../../models/dbconnect/db_connect');
const iconv = require('iconv-lite');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // req.body는 파일 업로드 후에 채워지므로, 여기서는 사용할 수 없습니다.
        cb(null, 'uploads/temp');  // 임시 저장 경로
    },
    filename: function (req, file, cb) {
        const filenameBuffer = Buffer.from(file.originalname, 'binary');
        const filename = iconv.decode(filenameBuffer, 'utf-8');
        console.log('Uploaded file name:', filename); 
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

router.post('/api/front/file/upload', upload.single('file'), async (req, res) => {
    let connection;
    try {
        connection = await getDBConnection();

        console.log('parsedData', req.body);

        const path1 = req.body && req.body.path1 ? req.body.path1 : 'default';
        const uploadPath = path.join('uploads', path1);

        // 디렉토리가 존재하지 않으면 생성
        fs.mkdirSync(uploadPath, { recursive: true });

        // 파일을 임시 경로에서 최종 경로로 이동
        const tempPath = path.join('uploads/temp', req.file.filename);
        const finalPath = path.join(uploadPath, req.file.filename);
        fs.renameSync(tempPath, finalPath);

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