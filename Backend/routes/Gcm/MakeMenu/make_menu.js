const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../../models/dbconnect/db_connect')

// 메뉴 생성
router.post('/api/create/menu', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const { menu_data, field_data }  = req.body;

    console.log(menu_data, field_data);

    // 동일 테이블이 있는지 확인
    const check_table_query = `
    SELECT COUNT(*) as cnt
    FROM gcm_crud_data
    WHERE top_menu = :top_menu
    AND data1 = :data1
    AND data2 = :data2
    AND data3 IS NULL
    AND data4 IS NULL
    AND data5 IS NULL`;


    const check_table_result = await connection.execute(check_table_query, [menu_data[0], menu_data[1], menu_data[2]]);

    // 상위메뉴 하위메뉴 중복 체크
    if (check_table_result.rows[0][0] > 0) {
          // data4, data6 추가 필요
          const gcm_field_query = `
          INSERT INTO gcm_crud_data
          (top_menu, data1, data2, data3, data5)
          VALUES 
          (:top_menu, :data1, :data2, :data3, :data5)`;

          for (let i = 0; i < field_data[1].length; i++) {
            const gcm_field_params = {
              top_menu: field_data[0],
              data1: menu_data[1],
              data2: menu_data[2],
              data3: field_data[1][i].DATA3,
              data5: field_data[1][i].DATA5,
            }
        
            const gcm_field_result = await connection.execute(gcm_field_query, gcm_field_params, { autoCommit: true });
            console.log(gcm_field_result);
        }

      res.status(200).send("성공");
      
    } else{
      // 상위메뉴 하위메뉴 저장
      const gcm_table_query = `
      INSERT INTO gcm_crud_data
      (top_menu, data1, data2)
      VALUES 
      (:top_menu, :data1, :data2)`;

      const gcm_table_params = {
        top_menu: menu_data[0],
        data1: menu_data[1],
        data2: menu_data[2],
      }

      const gcm_table_result = await connection.execute(gcm_table_query, gcm_table_params, { autoCommit: true });
      console.log(gcm_table_result)

          // data4, data6 추가 필요
        const gcm_field_query = `
        INSERT INTO gcm_crud_data
        (top_menu, data1, data2, data3, data5)
        VALUES 
        (:top_menu, :data1, :data2, :data3, :data5)`;

        for (let i = 0; i < field_data[1].length; i++) {
          const gcm_field_params = {
            top_menu: field_data[0],
            data1: menu_data[1],
            data2: menu_data[2],
            data3: field_data[1][i].DATA3,
            data5: field_data[1][i].DATA5,
          }
      
          const gcm_field_result = await connection.execute(gcm_field_query, gcm_field_params, { autoCommit: true });
          console.log(gcm_field_result);
      }

        res.status(200).send("성공");
    }
  } catch (err) {
    console.error(err);
  }
})


router.post('/api/gcm/data', async (req, res) => { 
  let connection;
  try{
    connection = await getDBConnection();

    const { site_name, table_name, data_1, data_2, data_3, data_4, data_5, data_6, data_7, data_8, data_9, data_10 } = req.body;

    const query = `
    INSERT INTO test_gcm_data_table
    (site_name, table_name, data_1, data_2, data_3, data_4, data_5, data_6, data_7, data_8, data_9, data_10)
    VALUES 
    (:site_name, :table_name, :data_1, :data_2, :data_3, :data_4, :data_5, :data_6, :data_7, :data_8, :data_9, :data_10)`

    gcm_data_table_params = {
      site_name,
      table_name,
      data_1: data_1 || null,
      data_2: data_2 || null,
      data_3: data_3 || null,
      data_4: data_4 || null,
      data_5: data_5 || null,
      data_6: data_6 || null,
      data_7: data_7 || null,
      data_8: data_8 || null,
      data_9: data_9 || null,
      data_10: data_10 || null
  }

    const result = await connection.execute(query, gcm_data_table_params, {autoCommit: true});

    console.log(result)

    res.status(200).send("등록 성공");

  } catch (err) {
    res.status(400).send(err);
    console.error(err);
  }
});

// GCM_CRUD 데이터 전송
router.get('/api/gcm/menu', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const main_query = `
    SELECT *
    FROM gcm_crud_main
    WHERE top_menu = '테이블필드확장'`

    const main_result = await connection.execute(main_query)

    // 각 행을 객체로 변환
    const main_data = main_result.rows.map(row => {
      let obj1 = {};
      row.forEach((item, index) => {
          obj1[main_result.metaData[index].name] = item;
      });
      return obj1;
    });

    const sub_query = `
    SELECT *
    FROM gcm_crud_data
    WHERE top_menu = '메뉴트리'`

    const sub_result = await connection.execute(sub_query)

    // 각 행을 객체로 변환
    const sub_data = sub_result.rows.map(row => {
      let obj = {};
      row.forEach((item, index) => {
          obj[sub_result.metaData[index].name] = item;
      });
      return obj;
    });

    res.status(200).json({ success: true , main_data: main_data[0], sub_data: sub_data});

  } catch (err) {
    console.error(err);
  }
})


// GCM_SUB_CRUD에 데이터 저장
router.post('/api/gcm/sub-menu', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const inputValues = req.body;

    const query = `
    INSERT INTO gcm_crud_data
    (top_menu, data1, data2, data3, data4, data5)
    VALUES 	
    ('메뉴트리', :data1, :data2, :data3, :data4, :data5)`;
    
    // inputValues 객체의 값들을 배열로 변환
    const params = Object.values(inputValues);
    
    const result = await connection.execute(query, params, { autoCommit: true });

    console.log(result)

    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
  }
})


// GCM_MAIN_CRUD에 데이터 저장
router.post('/api/gcm/main-menu', async (req, res) => {
  let connection;

  try {
    connection = await getDBConnection()

    const { top_menu, bottom_menu, description, admin, insert_user, insert_date, ...dataFields } = req.body;

    console.log(dataFields);

    let queryMain = `INSERT INTO GCM_CRUD_MAIN (top_menu, bottom_menu, description, admin, insert_user, insert_date`;
    let querySub = `INSERT INTO GCM_CRUD_SUB (top_menu, bottom_menu`;
    let valuesMain = [top_menu, bottom_menu, description, admin, insert_user, insert_date];
    let valuesSub = [top_menu, bottom_menu];
    let placeholdersMain = `) VALUES (:0, :1, :2, :3, :4, :5`;
    let placeholdersSub = `) VALUES (:0, :1`;

    for (let i = 1; i <= 100; i++) {
      queryMain += `, data${i}, data${i}_check`;
      querySub += `, data${i}, data${i}_type, data${i}_code`;
      placeholdersMain += `, :${4*i-2}, :${4*i-1}`;
      placeholdersSub += `, :${4*i}, :${4*i+1}, :${4*i+2}, :${4*i+3}`;
      valuesMain.push(dataFields[`data${i}`], dataFields[`data${i}_check`]);
      valuesSub.push(dataFields[`data${i}`], dataFields[`data${i}_type`], dataFields[`data${i}_code`]);
    }

    queryMain += placeholdersMain + ')';
    querySub += placeholdersSub + ')';

    // 두 쿼리가 모두 성공해야 commit
    await connection.execute(queryMain, valuesMain, { autoCommit: false });
    await connection.execute(querySub, valuesSub, { autoCommit: false });

    const result = await connection.commit();

    console.log(result)

    res.send('입력 성공');
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