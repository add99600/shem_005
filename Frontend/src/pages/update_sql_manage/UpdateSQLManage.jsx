import PageTemplate from "../template/page-template.jsx";
import UpdateSQLContent from "./UpdateSQLContent.jsx";

export default function UpdateSQLManage() {
  return (
    <PageTemplate
      headerTitle="등록 SQL 관리"
      panelBody={
        <>
          <UpdateSQLContent />
        </>
      }
    ></PageTemplate>
  );
}
