const express = require('express')
const router = express.Router();
const { getDBConnection } = require('../../models/dbconnect/db_connect')

router.get("/api/get/table/list", async (req, res) => {
    let connection;
    try {
        connection = await getDBConnection();

        // 환경안전의 DB TABLE 모두 조회
        let sql = `
        SELECT table_name, owner
        FROM all_tables
        WHERE OWNER = 'HMSHE'`

        const result = await connection.execute(sql)

        const tableNames = result.rows.map(row => row[0]);
        // console.log(tableNames);

        res.status(200).json({ success: true, data: tableNames });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error occurred');
    }
});

router.post("/api/post/table/column", async (req, res) => {
    let connection;
    try {
        connection = await getDBConnection();


        // 환경안전의 DB TABLE 모두 조회
        let sql = `
        SELECT table_name, owner
        FROM all_tables
        WHERE OWNER = 'HMSHE'`

        const result = await connection.execute(sql)

        const tableNames = result.rows.map(row => row[0]);
        console.log(tableNames);

        res.status(200).json({ success: true, data: tableNames });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error occurred');
    }
});

module.exports = router;