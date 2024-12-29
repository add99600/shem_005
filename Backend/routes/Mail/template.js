const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../../models/dbconnect/db_connect')
const oracledb = require('oracledb');

router.post('/api/make/mail/template', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    const { topMenu, name, sourceCode} = req.body;

    const result = await connection.execute(
      `INSERT INTO mail_template 
      (top_menu, name, template) 
      VALUES 
      (:top_menu, :name, :sourceCode)`,
      [topMenu, name, sourceCode], { autoCommit: true }
  );
  
    console.log('템플릿 저장 완료', result);

    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
  }
});

// 템플릿 이름 목록
router.get('/api/mail/template/list', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    const result = await connection.execute(
      `SELECT name
      FROM mail_template`
    );
  
    console.log(result.rows);

    res.status(200).json({ success: true, data: result.rows});

  } catch (err) {
    console.error(err);
  }
});

// 이름에 해당하는 템플릿 전송
router.post('/api/mail/template/data', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    const { selectedValue } = req.body;

    const value = selectedValue.label;

    const result = await connection.execute(`
      SELECT template
      FROM mail_template
      WHERE name = :value`,
      [value],       
      {
        fetchInfo: {
          "TEMPLATE": { type: oracledb.STRING }
        }
      }
    );

    res.status(200).json({ success: true, data: result.rows[0][0]});

  } catch (err) {
    console.error(err);
  }
});

router.get('/api/mail/list-view', async (req, res) => {
  let connection;
  try {
    connection = await getDBConnection();

    const result = await connection.execute(`
      SELECT user_id
      FROM dev_users
      where ROWNUM <= 10`
    );

    console.log(result)

    res.status(200).json({ success: true, data: result.rows});

  } catch (err) {
    console.error(err);
  }
});

module.exports = router;