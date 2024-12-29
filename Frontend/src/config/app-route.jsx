import React from "react";
import App from "./../App.jsx";

import Home from "./../pages/home/home.js";
import Error from "./../pages/error/error.js";

// 신규 Admin 컴포넌트 추가
// import MenuCreate from "../pages/menu/menu-create.jsx";
// import CodeMakeManage from "../pages/code/code-make-manage.jsx";
// import CodeFileManage from "../pages/code/code-file-manage.jsx";
// import Gcm from "../pages/system-admin/gcm.jsx";
// import MailManage from "../pages/mail/mail-manage.jsx";

// import CrudGcm from "../pages/table_manage/gcm/gcm_table_manage/crud-gcm-content.jsx";
// import CrudGcmData from "../pages/table_manage/gcm/gcm_data_manage/crud-gcm-data.jsx";
// import CodeManage from "../pages/table_manage/code/code_manage/code-manage.jsx";
// import CodeDataManage from "../pages/table_manage/code/code_data_manage/code-data-manage-content.jsx";
// import ColumnManage from "../pages/table_manage/column/column_manage/column-manage-content.jsx";
// import ColumnDataManage from "../pages/table_manage/column/column_data_manage/column-data-manage-content.jsx";

// import Dnd from "../pages/dnd-kit/dnd.jsx";
// import Manage_Check_List from "../pages/manage_check_list/manage-check-list.jsx";
// import Layout2 from "../pages/dnd-kit/dnd-content2.jsx";
// import Layout3 from "../pages/dnd-kit/dnd-content3.jsx";
// import Layout4 from "../pages/dnd-kit/TinyMCE/dnd-content4.jsx";
// import Layout5 from "../pages/dnd-kit/UI-HTML/dnd-makehtml.jsx";
// import TableColumn from "../pages/insert-menu/insert-menu.jsx";
import SQLManage from "../pages/sql_manage/SQLManage.jsx";
import ModelManage from "../pages/model_manage/ModelManage.jsx";
import MenuManage from "../pages/menu_manage/MenuManage.jsx";
import MakeGrapesJS from "../pages/grapesjs_manage/MakeGrapesManage.jsx";
import CodeStrManage from "../pages/code_manage/code-str-manage.jsx";
import FileManage from "../pages/file_manage/code-file-manage.jsx";
import Manage_Check_List from "../pages/manage_check_list/manage-check-list.jsx";
import TableManage from "../pages/table_manage/table-manage.jsx";
import ERP_Table from "../pages/erp_table/erp-table.jsx";
import SettingManage from "../pages/setting_manage/SettingManage.jsx";
import RegistSettingContent from "../pages/setting_manage/RegistSettingContent.jsx";
import UpdateSQLManage from "../pages/update_sql_manage/UpdateSQLManage.jsx";
import UpdateMenuManage from "../pages/update_sql_manage/UpdateMenuManage.jsx";
import LoginV1 from "../pages/User/login-v1.jsx";
import HtmlManage from "../pages/grapesjs_manage/HtmlManage.jsx";
import CodeJsonManage from "../pages/code_manage/code-json-manage.jsx";
import SiteMenuManage from "../pages/site_menu_manage/SiteMenuManage.jsx";
import ExcelUpload from "../pages/excel_upload/Excelupload.jsx";
import ApiManage from "../pages/api_manage/ApiManage.jsx";
import SiteMenuContent2 from "../pages/site_menu_manage/SiteMenuContent2.jsx";
// import MailTest from "../pages/mail/mail-test.jsx";
// import MailTest2 from "../pages/mail/mail-test2.jsx";

import FrontRoute from "./front-route.jsx";

const AppRoute = [
  {
    path: "*",
    element: <App />,
    children: [
      { path: "", element: <LoginV1 /> },
      { path: "home", element: <Home /> },
      { path: "sql-manage", element: <SQLManage /> },
      { path: "setting-manage", element: <SettingManage /> },
      { path: "model-manage", element: <ModelManage /> },
      { path: "menu-manage", element: <MenuManage /> },
      { path: "makegrapesjs", element: <MakeGrapesJS /> },
      { path: "code-str-manage", element: <CodeStrManage /> }, // gcm 코드 관리
      { path: "code-file-manage", element: <FileManage /> },
      { path: "manage-check-list", element: <Manage_Check_List /> },
      { path: "table-manage", element: <TableManage /> }, // table 통합 관리
      { path: "erp-table", element: <ERP_Table /> }, // 관리감독
      { path: "sql-update", element: <UpdateSQLManage /> },
      { path: "menu-update", element: <UpdateMenuManage /> },
      { path: "update-setting-manage", element: <RegistSettingContent /> },
      { path: "html-manage", element: <HtmlManage /> },
      { path: "code-json-manage", element: <CodeJsonManage /> },
      { path: "site-menu-manage", element: <SiteMenuManage /> },
      { path: "excel-upload", element: <ExcelUpload /> },
      { path: "api-manage", element: <ApiManage /> },
      { path: "site-menu-manage2", element: <SiteMenuContent2 /> },
      // { path: "mail-test", element: <MailTest /> },
      // { path: "mail-test2", element: <MailTest2 /> },

      // { path: "menu-create", element: <MenuCreate /> },
      // { path: "menu-manage", element: <MenuCreate /> },
      // { path: "menu-manage", element: <MenuCreate /> },
      // { path: "code-make", element: <CodeMakeManage /> },
      // { path: "code-file-manage", element: <CodeFileManage /> },
      // { path: "manage-check-list", element: <Manage_Check_List /> },
      // { path: "system", element: <Gcm /> },

      // { path: "gcm-table-manage", element: <CrudGcm /> },
      // { path: "gcm-data-manage", element: <CrudGcmData /> },
      // { path: "gcm-code-manage", element: <CodeManage /> },
      // { path: "gcm-code-data-manage", element: <CodeDataManage /> },
      // { path: "gcm-column-manage", element: <ColumnManage /> },
      // { path: "gcm-column-data-manage", element: <ColumnDataManage /> },

      // { path: "spread-sheet", element: <SpreadSheet /> },
      // { path: "insert_menu", element: <TableColumn /> },
      // { path: "layout", element: <Dnd /> },
      // { path: "layout2", element: <Layout2 /> },
      // { path: "layout3", element: <Layout3 /> },
      // { path: "layout4", element: <Layout4 /> },
      // { path: "layout5", element: <Layout5 /> },
      { path: "*", element: <Error /> },
    ],
  },
  ...FrontRoute,
];

export default AppRoute;
