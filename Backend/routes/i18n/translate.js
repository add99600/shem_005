const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../models/dbconnect/db_connect')

router.post('/api/translate/test', async (req, res) => {
    let connection;
    try {
      connection = await getDBConnection();
  
      const data_result = await connection.execute(`
        SELECT *
        FROM gcm_crud_data`
      );
  
      const data = data_result.rows.map(row => {
        let obj = {};
        row.forEach((item, index) => {
          obj[data_result.metaData[index].name] = item;
        });
        return obj;
      });
  
      const result = await connection.execute(`
        SELECT *
        FROM gcm_crud_main`
      );
  
      const main = result.rows.map(row => {
        let obj = {};
        row.forEach((item, index) => {
          if (item !== null) {
            obj[result.metaData[index].name] = item;
          }
        });
        return obj;
      });
  
      const columnNames = Object.keys(data[0]);
  
      // 번역 적용
      const lang = req.query.lang || 'en'; // 요청에서 언어를 가져옴 (기본값은 'en')
      const translatedData = translateData(data, lang);
      const translatedMain = translateData(main, lang);
  
      res.status(200).json({ success: true, data: translatedData, main: translatedMain, column: columnNames });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
  module.exports = router;