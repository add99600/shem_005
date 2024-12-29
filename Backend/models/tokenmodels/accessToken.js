require('dotenv').config();
const jwt = require('jsonwebtoken')

const accessToken = (id, Auth) => {
    const payload = { 
        USER_ID: id,
        USER_AUTH: Auth,
    };
    const secretKey = process.env.SECRET_KEY

    return jwt.sign(payload, secretKey, {expiresIn: '1h'}); 
}

module.exports = {accessToken};