const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const multer = require('multer');
const path = require('path');  // 추가
const fs = require('fs');      // 추가
const { getDBConnection } = require('../../models/dbconnect/db_connect');

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
    }),
    limits: {
        fileSize: 50 * 1024 * 1024  // 50MB
    }
});
  

router.post('/api/insert/longdata/:id', (req, res) => {
    upload.any()(req, res, async function(err) { 
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({ 
                success: false, 
                message: '파일 업로드 중 오류가 발생했습니다.',
                error: err.message 
            });
        } else if (err) {
            console.error('Upload error:', err);
            return res.status(500).json({ 
                success: false, 
                message: '서버 오류가 발생했습니다.',
                error: err.message 
            });
        }

        let connection;
        try {
            connection = await getDBConnection();
            
            // 데이터 처리
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

            if (req.file) {
                console.log('Uploaded file:', req.file);  // 디버깅용
                data.FILE_NAME = req.file.filename;
            }

        console.log('Processed data:', data);

        menu_id = req.params.id;

        // 메뉴 id를 기준으로 sql 쿼리 조회
        let sql = `
            select sql1, sql2, sql3, sql4, sql5
            from REGIST_SQL_MANAGE
            where menu_id = :menu_id
        `;

        // 동적으로 SQL_ID 받기
        const result = await connection.execute(sql, [menu_id]);

        console.log('Query result:', result);  // 디버깅용
        // rows[0]의 값들을 배열로 변환하고 null/undefined 값 제거
        const idArray = result.rows[0].filter(id => id != null);

        console.log('SQL IDs:', idArray);  // 디버깅용


        const insertLongData = async (connection, sql, bindParams) => {
            try {
                const processedBindParams = await Promise.all(bindParams.map(async (param) => {
                    if (typeof param === 'string' && param.includes('data:image')) {
                        const lobBindVar = await connection.createLob(oracledb.CLOB);
                        const chunkSize = 1024 * 1024; // 1MB로 증가
                        
                        // 대용량 데이터 처리를 위한 스트림 방식 사용
                        const chunks = [];
                        for (let j = 0; j < param.length; j += chunkSize) {
                            chunks.push(param.slice(j, j + chunkSize));
                        }
        
                        // 청크 순차적 처리
                        for (const chunk of chunks) {
                            await lobBindVar.write(chunk);
                        }
        
                        return lobBindVar;
                    }
                    if (param.val === 'SYSTIMESTAMP') {
                        return { val: new Date(), type: oracledb.DATE };
                    }
                    return param;
                }));
        
                // SQL 실행 설정 개선
                const result = await connection.execute(sql, processedBindParams, { 
                    autoCommit: false,
                    bindDefs: {
                        ...processedBindParams.reduce((acc, param, index) => {
                            acc[`val${index}`] = { 
                                type: param.type || oracledb.STRING,
                                maxSize: 1024 * 1024 * 50  // 50MB로 증가
                            };
                            return acc;
                        }, {})
                    },
                    fetchAsString: [oracledb.CLOB], // CLOB을 문자열로 처리
                    lobPrefetchSize: 0,             // CLOB 스트리밍 활성화
                    maxRows: 0                      // 행 제한 없음
                });
        
                // 리소스 정리
                for (const param of processedBindParams) {
                    if (param && typeof param.close === 'function') {
                        await param.close();
                    }
                }
        
                await connection.commit();
                return result;
            } catch (error) {
                // 에러 처리
                for (const param of bindParams) {
                    if (param && typeof param.close === 'function') {
                        await param.close();
                    }
                }
                throw error;
            }
        };

        // data 객체의 키와 값을 처리하는 함수
        const processValue = (value) => {
            if (value === null) {
                return 'NULL';
            } else if (value === 'CURRENT_TIMESTAMP') {
                return 'SYSTIMESTAMP';
            } else if (typeof value === 'string' && value.includes('data:image')) {
                return value; // CLOB 데이터는 그대로 반환
            } else if (typeof value === 'object') {
                // FILE1 객체를 FILE_NAME으로 변환
                if (value.name && value.size && value.type) {
                    return `'${value.name}'`;
                }
                return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
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

                    console.log('result1:', result1)
                    const clob = result1.rows[0][0];
                    const clobData = await new Promise((resolve, reject) => {
                        let data = '';
                        clob.setEncoding('utf8');
                        clob.on('data', chunk => data += chunk);
                        clob.on('end', () => resolve(data));
                        clob.on('error', err => reject(err));
                    });

                    let processedData = { ...data };
            
                    // FILE1 객체가 있다면 FILE_NAME으로 변환
                    if (processedData.FILE1) {
                        processedData.FILE_NAME = processedData.FILE1;
                        delete processedData.FILE1;
                    }
                    
                    // 불필요한 FILE 필드 제거
                    delete processedData.FILE2;
                    delete processedData.FILE3;
                    delete processedData.FILE4;
                    delete processedData.FILE5;
        
                    let keysArray = Object.keys(processedData);
                    let valuesArray = await Promise.all(
                        Object.values(processedData).map(processValue)
                    );

                    if (!keysArray.includes('ISRT_DT')) {
                        keysArray.push('ISRT_DT');
                        valuesArray.push('SYSTIMESTAMP');
                    }
                    if (!keysArray.includes('UPDT_DT')) {
                        keysArray.push('UPDT_DT');
                        valuesArray.push('SYSTIMESTAMP');
                    }
                    if (!keysArray.includes('UPDT_ID')) {
                        keysArray.push('UPDT_ID');
                        valuesArray.push('1240422');
                    }

                    const keys = keysArray.join(', ');
                    const values = valuesArray.map((v, i) => `:val${i}`).join(', ');

                    const replacedClobData = clobData
                        .replace('#keys#', keys)
                        .replace('#values#', values);

                    const bindParams = valuesArray.map((v, i) => {
                        return v.includes('data:image') ? v : { val: v, type: oracledb.STRING };
                    });

                    console.log('replacedClobData', replacedClobData)
                    console.log('bindParams', bindParams)

                    // 청크 단위로 데이터 삽입
                    await insertLongData(connection, replacedClobData, bindParams);

                } catch (error) {
                    console.error(`Error processing id ${id}:`, error);
                    throw error;
                }
            }
        }

        res.status(200).json({ success: true, message: '데이터가 성공적으로 저장되었습니다.' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: '데이터 저장 중 오류가 발생했습니다.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('DB connection close error:', err);
            }
        }
    }
})
});

module.exports = router;