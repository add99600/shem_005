const port = 5000
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser')
const app = express();
const { getDBConnection, getLog_DBConnection } = require('./models/dbconnect/db_connect')
const logger = require('./routes/Log/logger.js'); 

app.use(cors());
app.use(express.json());

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));




// hmshedb 연결 확인
getDBConnection()
  .then(async connection => {
    console.log('hmshe DB에 연결되었습니다.');
    // const result = await connection.execute(`
    // SELECT table_name, owner
    // FROM all_tables
    // WHERE OWNER = 'HMSHE'`);
    // console.log(result)
  })
  .then(result => {
    //console.log(result.rows);
  })
  .catch(err => console.log(err));


// logdb 연결 확인
getLog_DBConnection()
  .then(connection => {
    console.log('ep_inf DB에 연결되었습니다.');
    // return connection.execute(`SELECT * FROM ep_notice where seq_no = '2'`);
  })
  .then(result => {
    // console.log(result.rows);
  })
  .catch(err => console.log(err));

  

// 라우터 설정
const companyRouter = require('./routes/Company/company'); 
app.use('/', companyRouter)

const userRouter = require('./routes/User/user'); 
app.use('/', userRouter)

const GrapRouter = require('./routes/Grapjs/grap.js'); 
app.use('/', GrapRouter)

const translateRouter = require('./routes/Translate/translate.js'); 
app.use('/', translateRouter)

const EmailRouter = require('./routes/Mail/mail.js'); 
app.use('/', EmailRouter)

const ErpRouter = require('./routes/Erp/erp.js'); 
app.use('/', ErpRouter)

const File_uploadRouter = require('./routes/File/File_Upload.js'); 
app.use('/', File_uploadRouter)

const File_DataRouter = require('./routes/File/File_Data.js'); 
app.use('/', File_DataRouter)

const make_menuRouter = require('./routes/Gcm/MakeMenu/make_menu.js'); 
app.use('/', make_menuRouter)

const make_codeRouter = require('./routes/Gcm/MakeCode/make_code.js'); 
app.use('/', make_codeRouter)

const gcm_tableRouter = require('./routes/Gcm/GcmTable/gcm_table.js'); 
app.use('/', gcm_tableRouter)

const gcm_table_dataRouter = require('./routes/Gcm/GcmTable/gcm_table_data.js'); 
app.use('/', gcm_table_dataRouter)

const gcm_code_Router = require('./routes/Gcm/GcmCode/gcm_code.js'); 
app.use('/', gcm_code_Router)

const gcm_code_data_Router = require('./routes/Gcm/GcmCode/gcm_code_data.js'); 
app.use('/', gcm_code_data_Router)

const gcm_Column_Router = require('./routes/Gcm/Column/gcm_column.js'); 
app.use('/', gcm_Column_Router)

const gcm_Column_data_Router = require('./routes/Gcm/Column/gcm_column_data.js'); 
app.use('/', gcm_Column_data_Router)

const html_tag_Router = require('./routes/Gcm/HtmlTag/tag.js'); 
app.use('/', html_tag_Router)

const manage_check_listRouter = require('./routes/manage_check_list/manage-check-list.js'); 
app.use('/', manage_check_listRouter)

const i18nRouter = require('./routes/i18n/translate.js'); 
app.use('/', i18nRouter)

const MailRouter = require('./routes/Mail/template.js'); 
app.use('/', MailRouter)

const table_list_Router = require('./routes/table_list/table_list.js'); 
app.use('/', table_list_Router)

const crud_api_gcm_Router = require('./routes/Gcm/CRUD_API/gcm_crud.js'); 
app.use('/', crud_api_gcm_Router)

const crud_api_shem_Router = require('./routes/Gcm/CRUD_API/shem_crud.js'); 
app.use('/', crud_api_shem_Router)

const crud_menu_manage_Router = require('./routes/Gcm/CRUD_API/menu_manage.js'); 
app.use('/', crud_menu_manage_Router)

const html_template_Router = require('./routes/Gcm/CRUD_API/html_template.js');
app.use('/', html_template_Router)

const all_tables_Router = require('./routes/all_table/all_table.js');
app.use('/', all_tables_Router)

const Front_File_Upload_Router = require('./routes/File/Front_File_Upload.js');
app.use('/', Front_File_Upload_Router)

const Search_Condition_Router = require('./routes/search_condition/search_condition.js');
app.use('/', Search_Condition_Router)

const Shem007_Router = require('./routes/search_condition/shem007.js');
app.use('/', Shem007_Router)

const Shem016_Router = require('./routes/search_condition/shem016.js');
app.use('/', Shem016_Router)

const Shem002_Router = require('./routes/search_condition/shem002.js');
app.use('/', Shem002_Router)

const Weather_Router = require('./routes/new_api/api.js');
app.use('/', Weather_Router)

const ShemNotice_Router = require('./routes/search_condition/shemNotice.js');
app.use('/', ShemNotice_Router)

const Test_api_Router = require('./routes/new_api/test_api.js');
app.use('/', Test_api_Router)

const Main_Page_Router = require('./routes/search_condition/main_page.js');
app.use('/', Main_Page_Router)

const Risk_api_Router = require('./routes/search_condition/risk_api.js');
app.use('/', Risk_api_Router)

// const LogRouter = require('./routes/Log/logger.js'); 
// app.use('/', LogRouter)


// 에러 핸들링 미들웨어
// app.use(function(err, req, res, next) {
//   console.log(err)
//   logger.info(`Query: ${err.query}, Data: ${JSON.stringify(err.userData)}, Error: ${err.message}`);
//   res.status(err.status).send(err.message);
// });

app.listen(port, () => console.log(`${port}번 포트에서 서버가 시작되었습니다.`))


// table 생성
// const { SHE005_model } = require('./models/dbmodels/SHE005_model.js'); 
// SHE005_model();