import PageTemplate from "../template/page-template.jsx";
import UpdateMenuContent from "./UpdateMenuContent.jsx";

export default function UpdateSQLManage() {
  return (
    <PageTemplate
      headerTitle="등록 메뉴 관리"
      panelBody={
        <>
          <UpdateMenuContent />
        </>
      }
    ></PageTemplate>
  );
}
