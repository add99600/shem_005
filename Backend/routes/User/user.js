const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const { getDBConnection, getLog_DBConnection } = require('../../models/dbconnect/db_connect')
const { authMiddleware, authverify } = require('../../middleware/auth')
const { accessToken } = require('../../models/tokenmodels/accessToken')
const { refreshToken } = require('../../models/tokenmodels/refreshToken')
const { first_PW } = require('./first_PW')
const Save_Random_Password = require('../User/random_password')
const logger = require('../Log/logger');

router.post('/api/user/register', async (req, res, next) => {
    let connection;
    let query1;
    let userData;
  
    try {
        connection = await getDBConnection();
  
        const { id, name, password, email, phone, company, isrt_dt } = req.body;

        userData = { id, name, password, email, phone, company, isrt_dt }

        const query = `
        SELECT COUNT(*) AS count FROM dev_users WHERE user_id = :id`;

        const exists = await connection.execute(query, [id])

        if (0 < exists.rows[0][0])
        {
            res.status(400).json({ success: false, message: '이미 존재하는 아이디입니다.' });
            logger.info(`Query: ${query}, Data: ${JSON.stringify(userData)}, Error: 이미 존재하는 아이디입니다.`);
            return;
        }


        // 비밀번호 암호화
        const hash = bcrypt.hashSync(password, 10);

        query1 = 
        `INSERT INTO dev_users 
        (user_id, user_pw, name, email, phone, company_nm, isrt_dt) 
        VALUES (:id, :hash, :name, :email, :phone, :company, TO_DATE(:isrt_dt,'YYYY-MM-DD HH24:MI:SS'))`
  
        // 아이디 비번 권한 이름 이메일 휴대폰 permission 회사이름 등록일자 
        const result = await connection.execute(
            query1,
            [id, hash, name, email, phone, company, isrt_dt],
            { autoCommit: true }
        )
  
        res.status(200).json({ success: true });
        console.log(result);
    } catch (err) {
        // console.error(err);
        // logger.info(`Query: ${query}, Data: ${JSON.stringify(userData)}, Error: ${err.message}`);
        // res.status(500).send(err.message);
        err.query = query1;
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

router.post("/api/user/login", async (req, res, next) => {
    let connection;
    let query1
    let query2
    let userData

    try {
        connection = await getDBConnection();

        console.log(req.body)

        const { data: { id, password } } = req.body;

        userData = { id, password };

        query1 = `SELECT user_pw FROM dev_users WHERE user_id = :id`;
        query2 = `SELECT user_auth FROM dev_users WHERE user_id = :id`;

        const userPassword = await connection.execute(query1, [id]);
        const userAuth = await connection.execute(query2, [id]);

        // 유저 권한 1: 협력사 2: 하나마이크론 5: 관리자
        const Auth = userAuth.rows[0][0]
        
        // 해당 유저의 db에서 hash되어있는 비밀번호
        const hashedPassword = userPassword.rows[0][0];

        // 초기비밀번호: 81dc9bdb52d04dc20036dbd8313ed055
        // 초기비밀번호가 아니면 비밀번호 확인
        if ( await first_PW(id, password, connection, res, logger, userData) ) {

            // 토큰 생성
            const accesstoken = accessToken(id, Auth);
            const refreshtoken = refreshToken(id, Auth);

            // 초기비밀번호 전용 메시지
            const message = 'Login successful. Change your password.'

            // 로그인 시 해당 유저의 refrshtoken 재발급하여 db저장
            const refresh = await connection.execute(
                `UPDATE DEV_USERS SET refresh_token = :refreshtoken WHERE user_id = :id`, 
                [refreshtoken, id],
                { autoCommit: true }
            )
            
            res.status(200).json({
                success: true,
                accesstoken: accesstoken,
                message: message
            });

        } else if(bcrypt.compareSync(password, hashedPassword)){

            // 토큰 생성
            const accesstoken = accessToken(id);
            const refreshtoken = refreshToken(id);

            const message = 'Login successful.';

            // 로그인 시 해당 유저의 refrshtoken 재발급하여 db저장
            const refresh = await connection.execute(
                `UPDATE DEV_USERS SET refresh_token = :refreshtoken WHERE user_id = :id`, 
                [refreshtoken, id],
                { autoCommit: true }
            )
            
            res.status(200).json({
                success: true,
                accesstoken: accesstoken,
                message: message
            });
        }
        else {
            // logger.info(`Query: ${query}, Data: ${JSON.stringify(userData)}, Error: Login failed`);
            // res.status(400).json({ success: false, message: 'Login failed' });
            const err = new Error('Login failed');
            err.query = query1;
            err.userData = userData;
            err.status = 400
            next(err);
        }
    } catch (err) {
        // console.error(err.message);
        // logger.info(`Query: ${query}, Data: ${JSON.stringify(userData)}, Error: ${err.message}`);
        // res.status(500).send('Error occurred');
        err.query = query;
        err.userData = userData;
        err.status = 500
        next(err);
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


router.post('/api/user/password/update', authverify, async (req, res, next) => {
    let connection;
    let query;
    
    try {
        connection = await getDBConnection();
  
        const { password, isrt_dt } = req.body;

        userData = { password, isrt_dt }

        // 비밀번호 암호화
        const hash = bcrypt.hashSync(password, 10);

        // 미들웨어에서 decode한 값의 user_id 추출
        const id = req.user.USER_ID;

        query = 
        `UPDATE DEV_USERS 
        SET user_pw = :hash, updt_dt = TO_DATE(:isrt_dt,'YYYY-MM-DD HH24:MI:SS')
        WHERE USER_ID = :id`

        const result = await connection.execute(
            query,
            [hash, isrt_dt, id],
            { autoCommit: true }
        )
        
        console.log(result);
        res.status(200).json({ success: true });
    } catch (err) {
        // console.error(err);
        // res.status(500).send(err.message);
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

router.post('/api/user/info', authverify, async (req, res, next) => {
    let connection;
    let query;
  
    try {
        connection = await getDBConnection();

        const newtoken = req.newtoken

        const id = req.user.USER_ID;

        query =            
        `SELECT USER_ID, NAME, PHONE, COMPANY_NM, EMAIL
        FROM dev_users 
        WHERE USER_ID = :id`

        const result = await connection.execute(query, [id])

        const rows = result.rows;
        const metaData = result.metaData;

        const data = rows.map(row => {
            let obj = {};
            for(let i = 0; i < metaData.length; i++) {
                obj[metaData[i].name] = row[i];
            }
            return obj;
        });

        res.status(200).json({ success: true, data, newtoken });

    } catch (err) {
        // console.error(err);
        // res.status(500).send({ error: 'Internal Server Error' });

        userData = null;
        err.query = query;
        err.userData = userData;
        err.status = 500
        next(err);
    }
});

router.post('/api/user/info/update', authMiddleware, async (req, res, next) => {
    let connection;
    let query;
    let userData;
  
    try {
        connection = await getDBConnection();
  
        const { name, phone, email, password, isrt_dt } = req.body;

        userData = { name, phone, email, password, isrt_dt };

        // 비밀번호 암호화
        const hash = bcrypt.hashSync(password, 10);

        // 미들웨어에서 decode한 값의 user_id 추출
        const id = req.user.USER_ID;

        query =             
        `UPDATE dev_users
        SET name = :name, phone = :phone, email = :email, user_pw = :hash, updt_dt = TO_DATE(:isrt_dt,'YYYY-MM-DD HH24:MI:SS')
        WHERE USER_ID = :id`

        const result = await connection.execute(
            query, [name, phone, email, hash, isrt_dt, id],
            { autoCommit: true })

        console.log(result);

        res.status(200).json({ success: true });

    } catch (err) {
        // console.error(err);
        // res.status(500).send(err.message);
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

router.post('/api/user/logout', async (req, res) => {
    let connection;
    let query;
    let userData;
    let today
  
    try {
        connection = await getLog_DBConnection();

        today = new Date();   
  
        const { token } = req.body;

        userData = { token}

        query = 
        `INSERT INTO token_blacklist
        (access_token, time) 
        VALUES (:token, :today)`

        const result = await connection.execute(
            query, [token, today],
            { autoCommit: true })

        console.log(result);

        res.status(200).json({ success: true });

    } catch (err) {
        // console.error(err);
        // res.status(500).send(err.message);
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
})


router.post('/api/user/reset/password', async (req, res) => {
    let connection

    try{
        const { id, email } = req.body;

        connection = await getDBConnection();

        query = 
        `SELECT COUNT(*) as count
        FROM dev_users
        WHERE user_id = :id AND email = :email`

        const result = await connection.execute(
            query, [id, email],
            { autoCommit: true }
        )

        if (result.rows[0][0] === 1){
            Save_Random_Password(id, email)
            res.status(200).send("메일이 전송되었습니다");
        }
        else {
            res.status(500).send('정보가 일치하지 않습니다')
        }
    }
    catch(err){
        console.error(err);
        res.status(500).send('Error occurred');
    }
})

// 유저 권한 확인
router.post('/api/user/auth', authverify, async (req, res) => {
    let connection

    try{
        const id = req.user.USER_ID;

        connection = await getDBConnection();

        query = 
        `SELECT user_auth
        FROM dev_users
        where user_id = :user_id`

        const result = await connection.execute(
            query, [id],
            { autoCommit: true }
        )

        const user_auth = result.rows[0][0]

        res.status(200).json({ success: true , data: user_auth });
    }
    catch(err){
        console.error(err);
        res.status(500).send('Error occurred');
    }
})

module.exports = router;