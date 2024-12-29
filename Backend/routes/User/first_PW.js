async function first_PW(id, password, connection, res, logger, userData){
    if(password == '81dc9bdb52d04dc20036dbd8313ed055'){
        const matching = await connection.execute(`
            SELECT user_pw 
            FROM dev_users 
            WHERE user_id = :id `, 
            [id], {autoCommit: true})

        if ('81dc9bdb52d04dc20036dbd8313ed055' !== matching.rows[0][0]) {
            res.status(400).json({ success: false, message: '비밀번호가 변경되었습니다.' });
            logger.info(`Query: ${matching}, Data: ${JSON.stringify(userData)}, Error: 비밀번호가 변경되었습니다.`);
            return false;
        } 
            
        return true;
        
    }
    else{
        return false;
    }
}

module.exports = { first_PW };