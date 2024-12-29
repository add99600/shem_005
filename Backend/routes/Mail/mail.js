const express = require('express');
const router = express.Router();
const { sendMail } = require('./send_mail');

router.post('/api/email', (req, res) => {
  try{
    const { email, reference, inputdata }  = req.body;

    if (!email) return res.status(412).render({ message: '비정상적인 접근입니다.' });
  
    const toEmail = email
    const toreference = reference
    const toinputdata = inputdata
  
    sendMail(toEmail, toreference, toinputdata);
  
    res.status(200).send("성공");
  } catch (err) {
    console.error(err);
    return res.status(400).render('authResult', { message: '오류가 발생하였습니다.' });
  }
})

module.exports = router;