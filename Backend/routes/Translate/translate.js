const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const translate = path.join(__dirname, 'translate.json');
router.use(express.json());

router.post('/api/translate/updatejson', (req, res) => {
  fs.readFile(translate, 'utf8', function readFileCallback(err, data){
    if (err){
      console.log(err);
      res.status(500).send('Server error');
    } else {
      // 기존 json 데이터
      let obj = JSON.parse(data);
      
      // key가 이미 존재하는 경우 값 수정 그렇지 않은 경우 새 배열 생성.
      for (let key in req.body) {
        obj[key] = req.body[key];
      }

      let json = JSON.stringify(obj); 
      
      fs.writeFile(translate, json, 'utf8', (err) => { 
        if (err) {
          console.log(err);
          res.status(500).send('Server error');
        } else {
          res.send({success: 'true', message: data});
        }
      }); 
    }
  });
});

// translate.json 데이터 전송
router.get('/api/jsondata', (req, res) => {
  fs.readFile(translate, 'utf8', (err, jsonString) => {
      if (err) {
          console.log("File read failed:", err);
          return res.status(500).send('Server Error');
      }
      res.send(jsonString);
  });
});


module.exports = router;