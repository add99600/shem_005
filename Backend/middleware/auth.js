require('dotenv').config();
const { getDBConnection, getLog_DBConnection } = require('../models/dbconnect/db_connect')
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY

// 토큰 유효성 검사
const authMiddleware = async (req, res, next) => {
    
    const { token } = req.body;

    if (!token) {
        return res.status(402).json({ message: 'Token is not found' });
    }
    
    const decoded = jwt.decode(token);
    

    //토큰 검증
    try {
        jwt.verify(token, secretKey, (err) => {
            if (err) {
                return res.status(401).json({ message: '토큰이 유효하지 않습니다' });
            } else {
                req.user = decoded
                next();
            }
        });
    } catch (err) {
        return res.status(401).json({ message: 'Token verification failed' });
    }
};


// 토큰 유효성 검사 후 새 토큰 발급
const authverify = async (req, res, next) => {
    let connection;
    let black_listDB;
    const nulltoken = 'undefined';

    const { token } = req.body.data;

    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    else if (token) {

        // black_list에 등록된 token인지 확인
        black_listDB = await getLog_DBConnection();
        const exists = await black_listDB.execute(`
            SELECT COUNT(*) AS count FROM token_blacklist WHERE access_token = :token`, 
            [token])

        if (0 < exists.rows[0][0]){
            return res.status(400).send({ auth: false, message: 'Token is blacklisted.' });
        }
        else {
            try {
                const decoded = jwt.decode(token);
                const id = decoded.USER_ID;
                connection = await getDBConnection();
                const result = await connection.execute(`
                    SELECT refresh_token
                    FROM dev_users
                    WHERE user_id = :id`, 
                    [id]
                );
                const refreshToken = result.rows[0][0];

                try {
                    const decoded = jwt.verify(token, secretKey);
                    req.newtoken = nulltoken;
                    req.user = decoded;
                } catch (err) {
                    try {
                        const decoded = jwt.verify(refreshToken, secretKey);
                        const newAccessToken = jwt.sign({ USER_ID: decoded.USER_ID, USER_AUTH: decoded.USER_AUTH }, secretKey, { expiresIn: '1h' });
                        req.newtoken = newAccessToken;
                        req.user = decoded;
                    } catch (err) {
                        return res.status(401).send({ auth: false, message: '토큰이 만료되었습니다. 다시 로그인 해주세요.' });
                    }
                }
                next();
            } catch (err) {
                console.error(err);
                res.status(500).send({ error: 'Internal Server Error' });
            }
        }
    }


}


module.exports = { authMiddleware, authverify };
