const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../../models/dbconnect/db_connect')


router.post('/api/insert/htmltag', async (req, res) => {
    let connection;
    try{
        connection = await getDBConnection();

        const { TAG, DATA, HTML, NAME } = req.body;
    
        const sql = `
        INSERT INTO GCM_CRUD_DATA 
        (TOP_MENU, DATA1, DATA2) 
        VALUES (:TAG, :NAME, :HTML)`

        const result = await connection
            .execute(sql, {TAG: '태그', NAME, HTML}, { autoCommit: true })

        res.status(200).json({ success: true })
  
    } catch (err) {
      console.error(err);
    }
})


router.get('/api/get/htmltag', async (req, res) => {
    let connection;
    try{
        connection = await getDBConnection();

        // 1부터 50까지의 숫자 배열 생성
        const numbers = Array.from({ length: 50 }, (_, i) => i + 1);

        // 숫자 배열을 'DATA1', 'DATA2', ..., 'DATA50' 형태의 문자열 배열로 변환
        const dataFields = numbers.map(number => `DATA${number}`);

        // 문자열 배열을 쉼표로 구분된 문자열로 변환
        const dataFieldsStr = dataFields.join(', ');

        const sql = `
        SELECT ${dataFieldsStr}
        FROM GCM_CRUD_DATA
        WHERE TOP_MENU = :TAG`

        const result = await connection
            .execute(sql, {TAG: '태그'})

        // result.rows에서 null 값을 제외
        const filteredRows = result.rows.map(row => row.filter(item => item !== null));

        res.status(200).json({ success: true, data: filteredRows })
  
    } catch (err) {
      console.error(err);
    }
})

module.exports = router;