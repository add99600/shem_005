const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../../models/dbconnect/db_connect')
const oracledb = require('oracledb');

router.post('/api/create/code', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const { top_menu, description, data1, data2, data3, data4, data5 }  = req.body;

    // 동일한 데이터가 있는지 확인
    const check_table_query = `
    SELECT COUNT(*) as cnt
    FROM gcm_code
    WHERE top_menu = :top_menu`
    
    const check_table_result = await connection.execute(check_table_query, [ top_menu ])
    
    if (check_table_result.rows[0][0] > 0) {
      return res.status(403).json({ message: '동일한 데이터가 존재합니다.' });
    }

    const query = `
    INSERT INTO gcm_code 
    (top_menu, description, data1, data2, data3, data4, data5) 
    VALUES (:top_menu, :description, :data1, :data2, :data3, :data4, :data5)`;

    result = await connection.execute(query, [top_menu, description, data1, data2, data3, data4, data5], { autoCommit: true });

    res.status(200).json({ success: true });

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

router.post('/api/create/bottom', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const { top_menu, data1, data2 }  = req.body;

    // 동일한 데이터가 있는지 확인
    const check_table_query = `
    SELECT COUNT(*) as cnt
    FROM gcm_code_data
    WHERE data2 = :data2`
    
    const check_table_result = await connection.execute(check_table_query, [ data2 ])
    
    if (check_table_result.rows[0][0] > 0) {
      return res.status(403).json({ message: '동일한 데이터가 존재합니다.' });
    }

    const query = `
    INSERT INTO gcm_code_data
    (top_menu, data1, data2) 
    VALUES (:top_menu, :data1, :data2)`;

    result = await connection.execute(query, [top_menu, data1, data2], { autoCommit: true });

    res.status(200).json({ success: true });

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


router.post('/api/search/code', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const search_menu_query = `
    SELECT DISTINCT top_menu
    FROM gcm_code`
    
    const menu_result = await connection.execute(search_menu_query)

    // 한 리스트에 데이터를 담는다
    const menu = menu_result.rows.map(row => row[0]);

    res.status(200).json({ success: true, menu: menu });

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



router.post('/api/search/bottom/menu', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const { code }  = req.body;

    const search_query = `
    SELECT DISTINCT data1
    FROM gcm_code_data
    where top_menu = :code`
    
    const check_table_result = await connection.execute(search_query,[code])

    // 한 리스트에 데이터를 담는다
    const data = check_table_result.rows.map(row => row[0]);

    let groupData = {};

    for (let i of data) {
        const search_query = `
        SELECT data1, data2, data3, data4, data5
        FROM gcm_code_data
        where data1 = :i`;
        const result = await connection.execute(search_query, [i]);
    
        for (let row of result.rows) {
            if (!groupData[row[0]]) {
                groupData[row[0]] = [];
            }
            groupData[row[0]].push(row[1]);
        }
    }
    
    console.log(groupData);
    

    res.status(200).json({ success: true, data: groupData});

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


// data1에 해당하는 코드 조회
router.post('/api/search/code/minor', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    console.log(req.body)

    let code;
    if (req.body.code) {
      // { code: selectedCode } 형식의 요청 처리
      code = req.body.code;
    } else {
      // { '공구리스트': '' } 형식의 요청 처리
      code = Object.keys(req.body)[0];
    }

    const search_query = `
    SELECT data2, data3, data4, data5, id, json_data
    FROM gcm_code_data
    where data1 = :code`
    
    const result = await connection.execute(search_query,[code])

    // CLOB 데이터를 처리하는 부분
    const data = await Promise.all(result.rows.map(async row => {
      const obj = {};
      
      for (let i = 0; i < row.length; i++) {
        const columnName = result.metaData[i].name;
        const item = row[i];

        if (columnName === 'JSON_DATA' && item instanceof oracledb.Lob) {
          // CLOB 데이터 읽기
          let jsonString = '';
          item.setEncoding('utf8');
          for await (const chunk of item) {
            jsonString += chunk;
          }
          
          try {
            // JSON 파싱
            obj[columnName] = jsonString;
            console.log('Successfully read JSON_DATA:', jsonString);
          } catch (error) {
            console.error('Error parsing JSON:', error);
            obj[columnName] = null;
          }
        } else {
          obj[columnName] = item;
        }
      }
      return obj;
    }));

    console.log('Processed data:', data); // 데이터 확인용 로그

    const column = result.metaData.map(meta => meta.name);
    
    res.status(200).json({ success: true, data: data, column: column});

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


// top_menu에 해당하는 코드 조회
router.get('/api/search/code/:top_menu/:data1', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    console.log(req.params)

    const top_menu = req.params.top_menu;
    const data1 = req.params.data1;

    const search_query = `
    SELECT *
    FROM gcm_code_data
    where top_menu = :top_menu
    and data1 = :data1`
    
    const result = await connection.execute(search_query,[top_menu, data1])

    // CLOB 데이터 처리
    const data = await Promise.all(result.rows.map(async row => {
      const obj = {};
      
      for (let i = 0; i < row.length; i++) {
        const columnName = result.metaData[i].name;
        const item = row[i];

        if (columnName === 'JSON_DATA' && item instanceof oracledb.Lob) {
          // CLOB 데이터 읽기
          let jsonString = '';
          item.setEncoding('utf8');
          for await (const chunk of item) {
            jsonString += chunk;
          }
          
          try {
            // JSON 파싱
            obj[columnName] = jsonString;
            console.log('Successfully read JSON_DATA:', jsonString);
          } catch (error) {
            console.error('Error parsing JSON:', error);
            obj[columnName] = null;
          }
        } else {
          obj[columnName] = item;
        }
      }
      return obj;
    }));

    console.log('Processed data:', data); // 데이터 확인용 로그
    
    res.status(200).json({ success: true, data: data});

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

router.post('/api/add/code', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const data = req.body.data;

    console.log('데이터 추가', data)

    const query = `
    SELECT *
    FROM gcm_code_data
    where top_menu = :menu
    and data1 = :code`

    const result = await connection.execute(query, [menu, code])

    console.log(result.rows)

    const insertQuery = `
    INSERT INTO gcm_code_data 
    (top_menu, data1, data2)
    VALUES (:menu, :code, :data2)`;

    for (const item of data) {
      await connection.execute(insertQuery, [menu, code, item.name], {autoCommit: true});
    }

    res.status(200).json({ success: true });

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

router.put('/api/update/code', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const SelectedData = req.body.data.SelectData;
    const SelectedCode = req.body.data.SelectCode;
    const data = req.body.data.Data;

    console.log('데이터 추가', SelectedData, SelectedCode, data)

    // ID를 배열에서 제거
    const keys = Object.keys(data).filter(key => key !== 'ID');

    // bind 변수 동적생성
    const binds = keys.map((key, i) => `${key} = :${i+1}`).join(', ');

    // 데이터 객체를 바인딩 변수로 변환
    const bindVars = keys.reduce((acc, key, i) => {
      acc[`${i+1}`] = data[key];
      return acc;
    }, {});

    const query = `
    UPDATE gcm_code_data
    SET ${binds}
    WHERE top_menu = :SelectedData
    AND data1 = :SelectedCode
    AND ID = :id`

    const result = await connection.execute(query, [SelectedData, SelectedCode, id], { autoCommit: true },)

    console.log(result.rows)

    res.status(200).json({ success: true });

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

router.delete('/api/delete/code', async (req, res) => {
  let connection;
  try{
    connection = await getDBConnection();

    const data = req.body.data;
    const menu = req.body.menu;
    const code = req.body.code;

    const nameArray = data.map(item => item.name);

    console.log(nameArray); // ['BUMP', '3라인', '3라인', '1라인', '2라인']

    const deleteQuery = `
    DELETE FROM gcm_code_data 
    WHERE top_menu = :menu
    AND data1 = :code
    AND data2 = :name`;

    for (const item of data) {
      await connection.execute(deleteQuery, [menu, code, item.name], {autoCommit: true});
    }

    res.status(200).json({ success: true });

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

module.exports = router;