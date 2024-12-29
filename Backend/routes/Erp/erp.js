const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const { authverify } = require('../../middleware/auth')
const { getDBConnection } = require('../../models/dbconnect/db_connect')

router.post('/api/erp/data', async (req, res, next) => {
    let connection;
    let query;
    let userData;
  
    try {
        connection = await getDBConnection();
  
        const { id } = req.body;

        console.log(id)

        userData= { id }

        query = `
        SELECT name, dep_name 
        FROM HMSHE.SHE_EMP_DEPT_VIEW 
        WHERE emp_no = :id`;

        const result = await connection.execute(query, [id])

        const data = result.rows[0];

        res.status(200).json({ success: true, data: data });

    } catch (err) {
         console.error(err);
         logger.info(`Query: ${query}, Data: ${JSON.stringify(userData)}, Error: ${err.message}`);
         res.status(500).send(err.message);
         err.query = query;
         err.userData = userData;
         err.status = 500
         next(err);
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

router.post('/api/erp/data/spread', async (req, res, next) => {
    let connection;
    let query;
    let userData = [];
  
    try {
        connection = await getDBConnection();
  
        const { id } = req.body;

        console.log(id);

        query = `
        SELECT emp_no, name, dep_name 
        FROM HMSHE.SHE_EMP_DEPT_VIEW 
        WHERE emp_no = :emp_no`;

        for (let i = 0; i < id.length; i++) {
            const emp_no = id[i].toString(); // 문자열 변환
            const result = await connection.execute(query, { emp_no });
            const data = result.rows[0];
            if (data) {
                userData.push(data);
            }
        }
        
        console.log(userData)

        res.status(200).json({ success: true, data: userData });
        
    } catch (err) {
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