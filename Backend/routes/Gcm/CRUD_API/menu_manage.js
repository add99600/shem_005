const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../../models/dbconnect/db_connect');

router.get('/api/query/:id', async (req, res) => {
    let connection;
    try{
      connection = await getDBConnection();
  
      const id = req.params.id

      console.log(id)
  
      const sql = `
          SELECT sql_detail
          FROM check_sql_manage
          WHERE id = :id`
  
      const result = await connection.execute(sql, [id]);


      const clob = result.rows[0][0]; 

      const getQueryData = () => {
        return new Promise((resolve, reject) => {
          let query_data = '';
          clob.setEncoding('utf8'); 
          clob.on('data', chunk => {
            query_data += chunk; 
          });
          clob.on('end', () => {
            resolve(query_data);
          });
          clob.on('error', (err) => {
            reject(err);
          });
        });
      };

      getQueryData().then(async query_data => {
        const query_result = await connection.execute(query_data);

        // key:value 형식으로 변환
        const data = query_result.rows.map(row => {
            let obj = {};
            row.forEach((item, index) => {
                obj[query_result.metaData[index].name] = item;
            });
            return obj;
        });

        res.status(200).json({ success: true, data: data });
      }).catch(err => {
        console.error(err);
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false })
    }
})

module.exports = router;