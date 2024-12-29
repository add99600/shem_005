const express = require('express')
const router = express.Router();
const { getDBConnection } = require('../../models/dbconnect/db_connect')
const { authMiddleware, authverify } = require('../../middleware/auth')

router.get("/api/HMSHE311", async (req, res) => {
    let connection;
    try {
        connection = await getDBConnection();

        // 등록순 정렬
        const result = await connection.execute(`
            SELECT testSHEM005.*, USERS.DEP_NAME 
            FROM testSHEM005
            INNER JOIN SHE_EMP_DEPT_VIEW USERS 
            ON testSHEM005.ISRT_ID = USERS.EMP_NO
            WHERE testSHEM005.deleted IS NULL
            ORDER BY testSHEM005.ISRT_DT DESC
        `);

        // 각 행을 객체로 변환
        const data = result.rows.map(row => {
            let obj = {};
            row.forEach((item, index) => {
                obj[result.metaData[index].name] = item;
            });
            return obj;
        });

        console.log(data[0][0])

        res.status(200).json({ success: true, data: data[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error occurred');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.log(err);
            }
        }
    }
});


router.post('/api/work/register', async (req, res) => {
    console.log('버튼 요청 옴')
    let connection;
    try {
        connection = await getDBConnection();

        const data = req.body;
        console.log('버튼 데이터',data);

        const keys = Object.keys(data).join(', ');
        const values = Object.values(data);
        const placeholders = values.map((_, i) => `:${i}`).join(', ');

        let sql = `
        INSERT INTO gcm_crud_data
        (${keys})
        VALUES
        (${placeholders})`;

        const result = await connection.execute(sql, values,{ autoCommit: true });

        console.log(result)

        res.status(200).json({ success: true });

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

router.get('/api/work/view/:id', async (req, res) => {
    let connection;
    let postId = req.params.id;

    try {
        connection = await getDBConnection();

        // 등록순 정렬
        const result = await connection.execute(`
            SELECT *
            FROM testshem005
            WHERE id = :id`,
            [postId]
        );

        const data = result.rows.map(row => {
            let obj = {};
            row.forEach((item, index) => {
                // metadata에서 열 이름 가져오기
                obj[result.metaData[index].name] = item;
            });
            return obj;
        });

        res.status(200).json({ success: true, data: data });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error occurred');
    } finally {
        if (connection) {
        try {
            await connection.close();
        } catch (err) {
            console.log(err);
        }
    }}
});

router.get('/api/work/delete/:id', async (req, res) => {
    let connection;
    let postId = req.params.id;

    try {
        connection = await getDBConnection();

        const result = await connection.execute(
            `UPDATE testshem005
            SET deleted = 'Y'
            WHERE id = :postId`,
            [postId],
            { autoCommit: true }
        )

        console.log(result);

        res.status(200).json({ success: true });


    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
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