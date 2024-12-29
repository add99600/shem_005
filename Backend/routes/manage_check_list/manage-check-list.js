const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../models/dbconnect/db_connect')

router.get('/api/manage/checklist', async(req, res) => {
    let connection;
    try{
      connection = await getDBConnection();

      const query = `
      SELECT DISTINCT data2
      FROM gcm_code_data
      WHERE data1 = '관리감독자 점검 체크리스트'`

      list_result = await connection.execute(query);

      res.status(200).json({ success: true, list: list_result.rows});

    } catch (err) {
        console.error(err);
    }
});

router.post('/api/manage/selected', async(req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    SelectData = req.body.selectedValue

    // 배열의 첫 번째 요소를 추출
    if (Array.isArray(SelectData) && SelectData.length > 0) {
      SelectData = SelectData[0];
    }

    const query = `
    SELECT data3, id
    FROM gcm_code_data
    WHERE data2 = :SelectData`

    result = await connection.execute(query,[SelectData]);

    const data = result.rows.map(row => {
      let obj = {};
      row.forEach((item, index) => {
          obj[result.metaData[index].name] = item;
      });
      return obj;
    });

    // 선택한 목록의 파트 리스트
    const part_query = `
    SELECT data2
    FROM gcm_code_data
    WHERE data3 = :SelectData`

    console.log(SelectData)

    part_result = await connection.execute(part_query,[SelectData]);

    const part_data = part_result.rows.map(row => {
      let obj = {};
      row.forEach((item, index) => {
          obj[part_result.metaData[index].name] = item;
      });
      return obj;
    });

    const all_part_query = `
    SELECT data2
    FROM gcm_code_data
    WHERE DATA1 = '부서목록'`

    all_part_result = await connection.execute(all_part_query);

    res.status(200).json({ success: true, detail: data, part: part_data, all_part: all_part_result.rows});

  } catch (err) {
    console.error(err);
}
})

// 체크된 값
router.post('/api/manage/checked', async(req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    console.log('Request Body:', req.body);
    
    let checkedData = JSON.parse(req.body.checkedItems);
    let uncheckData = JSON.parse(req.body.uncheckedItems);
    let checkedDetail = JSON.parse(req.body.detail)[0];

    console.log(checkedData, uncheckData, checkedDetail);

    // checkedData 저장
    for (let item of checkedData) {
      // 동일한 레코드가 있는지 확인
      const checkQuery = `
        SELECT COUNT(*) AS count
        FROM gcm_code_data
        WHERE top_menu = '부서목록'
          AND data1 = '점검 부서목록'
          AND data2 = '${item}'
          AND data3 = '${checkedDetail}'`;

      const checkResult = await connection.execute(checkQuery);
      const count = checkResult.rows[0][0];

      // 동일한 값이 없는 경우에만 삽입
      if (count === 0) {
        const insertQuery = `
          INSERT INTO gcm_code_data
          (top_menu, data1, data2, data3)
          VALUES 
          ('부서목록', '점검 부서목록', '${item}', '${checkedDetail}')`;

        const result = await connection.execute(insertQuery, [], { autoCommit: true });
        console.log(`삽입된 값: data2='${item}', data3='${checkedDetail}'`);
        console.log(result);
      } else {
        console.log(`데이터가 존재합니다: ${item}, ${checkedDetail}`);
      }
    }

    // uncheckedData가 데이터베이스에 있을 경우 삭제
    for (let item of uncheckData) {
      const deleteQuery = `
        DELETE FROM gcm_code_data
        WHERE top_menu = '부서목록'
          AND data1 = '점검 부서목록'
          AND data2 = '${item}'
          AND data3 = '${checkedDetail}'`;
    
      const result = await connection.execute(deleteQuery, [], { autoCommit: true });
      console.log(`data2='${item}', data3='${checkedDetail}'`);
      console.log(result);
    }

    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
})

module.exports = router;