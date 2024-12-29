const express = require('express')
const router = express.Router();
const request = require('request')
const axios = require('axios');
const dbConfig = require('../../models/dbconnect/db_config');
const { getDBConnection } = require('../../models/dbconnect/db_connect')

router.post('/api/test/data', async (req, res) => {
  const { company_name } = req.body;
  var url = 'http://apis.data.go.kr/B552015/NpsBplcInfoInqireService/getBassInfoSearch';
  var queryParams = '?' + `serviceKey=${process.env.COMPANY_KEY}` /* Service Key*/
  queryParams += '&' + encodeURIComponent('wkplNm') + '=' + encodeURIComponent(company_name);
  const openApiUrl = url + queryParams;

  try {
    const response = await axios.get(openApiUrl);  // 수정된 부분
    console.log(response.data);  // 수정된 부분
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('서버 요청 실패:', error);
  }
});

router.post ('/api/company', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const { data }  = req.body;

    const parsedData = JSON.parse(data);
    const inputValue = parsedData.inputValue;

    const search_query = `
      SELECT *
      FROM users
      WHERE name = :inputValue OR company_regist_name = :inputValue`;
    
    const result = await connection.execute(search_query,[inputValue])

    // 각 행을 객체로 변환
    const json_data = result.rows.map(row => {
      let obj = {};
        row.forEach((item, index) => {
           obj[result.metaData[index].name] = item;
        });
       return obj;
    });
    
    res.status(200).json({ success: true, data: json_data });

  } catch (err) {
    console.error(err);
  }finally {
    if (connection) {
        try {
            await connection.close();
        } catch (err) {
            console.error(err);
        }
    }
  }
})













// router.post("/api/insert_Company", async (req, res) => {
//     let connection;
//     try {
//       connection = await oracledb.getConnection(dbConfig);
//       const result = await connection.execute(
//         `INSERT INTO company (companyName, regNumber1, regNumber2, regNumber3, masterName, address, regDate) 
//          VALUES (:companyName, :regNumber1, :regNumber2, :regNumber3, :masterName, CURRENT_TIMESTAMP)`,
//         {
//           companyName: req.body.companyName,
//           regNumber1: req.body.regNumber1,
//           regNumber2: req.body.regNumber2,
//           regNumber3: req.body.regNumber3,
//           masterName: reg.body.masterName,
//           address: req.body.address,
//         },
//         { autoCommit: true }
//       );
//       console.log(result);
//       res.status(200).send('데이터가 성공적으로 저장되었습니다.');
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('INSERT 실패');
//     } finally {
//       if (connection) {
//         try {
//           await connection.close();
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     }
//   });
  
  module.exports = router;