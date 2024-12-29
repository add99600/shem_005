import PageTemplate from "../template/page-template.jsx";
import SettingContent from "./SettingContent.jsx";

function SettingManage() {
  return (
    <PageTemplate
      headerTitle="setting 관리"
      panelBody={
        <>
          <SettingContent />
        </>
      }
    ></PageTemplate>
  );
}

export default SettingManage;
