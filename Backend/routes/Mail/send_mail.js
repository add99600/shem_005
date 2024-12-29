const nodemailer = require("nodemailer");
const secretip = process.env.EMAIL_IP
const secretport = process.env.EMAIL_PORT
// const secretaddress = process.env.EMAIL_ADDRESS
// const secretpassword = process.env.EMAIL_PASSWORD


function sendMail (toEmail, toreference, toinputdata) {
  const transporter = nodemailer.createTransport({
    host: secretip,
    port: secretport, 
    auth: null,
    //debug: true,
    //logger: true
  });
  const mailOptions = {
    from: 'test@hanamicron.co.kr', 
    to: toEmail,  // 받는 사람
    cc: toreference, // 참조
    // bcc: "id4@gmail.com", // 비밀 참조
    subject: "test 제목입니다.", // 제목
    text : "html을 지원하지 않습니다", // html 미지원 시
    html: `
    <p>${toinputdata}</p>
  `,
    // attachments: [
    //   {
    //     filename: 'file.txt',
    //     path: '/path/to/file.txt'
    //   }
    // ]
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred: ' + error.message);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

/* <table style="width:100%; border: 1px solid black; border-collapse: collapse;">
<tr>
  <th style="border: 1px solid black;">Firstname</th>
  <th style="border: 1px solid black;">Lastname</th> 
  <th style="border: 1px solid black;">Age</th>
</tr>
<tr>
  <td style="border: 1px solid black;">이</td>
  <td style="border: 1px solid black;">홍재</td> 
  <td style="border: 1px solid black;">25</td>
</tr>
<tr>
  <td style="border: 1px solid black;">Eve</td>
  <td style="border: 1px solid black;">Jackson</td> 
  <td style="border: 1px solid black;">94</td>
</tr>
</table> */

// 비밀번호 초기화 메일
function Random_password_Mail (email, random_pass) {
  const transporter = nodemailer.createTransport({
    host: secretip,
    port: secretport, 
    auth: null,
    //debug: true,
    //logger: true
  });
  const mailOptions = {
    from: 'test@hanamicron.co.kr', 
    to: email,  // 받는 사람
    // cc: toreference, // 참조
    // bcc: "id4@gmail.com", // 비밀 참조
    subject: "임시 비밀번호입니다.", // 제목
    text : "html을 지원하지 않습니다", // html 미지원 시
    html: `
    <p>임시 비밀번호 입니다.</p><br/>
    <p>${random_pass}</p>`
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred: ' + error.message);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = { sendMail, Random_password_Mail };