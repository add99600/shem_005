const { getDBConnection } = require('../../models/dbconnect/db_connect')
const bcrypt = require('bcrypt')
const { Random_password_Mail } = require('../Mail/send_mail');


const Save_Random_Password = async (id, email) => {
    const connection = await getDBConnection();

    // 난수 비밀번호
    const random_pass = Math.random().toString(36).slice(2);

    // 난수 비밀번호 암호화
    const hash_pass = bcrypt.hashSync(random_pass, 10);

    query = 
    `UPDATE DEV_USERS
    SET user_pw = :hash_pass
    WHERE user_id = :id AND email = :email`

    const result = await connection.execute(
        query, [hash_pass, id, email],
        { autoCommit: true }
    )
    console.log(random_pass, result)

    Random_password_Mail(email, random_pass);
}

module.exports = Save_Random_Password;