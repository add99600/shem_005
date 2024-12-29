import PageTemplate from "../template/page-template.jsx";
import RegistSettingContent from "./RegistSettingContent.jsx";

function RegistSettingManage() {
  return (
    <PageTemplate
      headerTitle="regist setting 관리"
      panelBody={
        <>
          <RegistSettingContent />
        </>
      }
    ></PageTemplate>
  );
}

export default RegistSettingManage;
