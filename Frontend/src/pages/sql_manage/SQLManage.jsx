import PageTemplate from "../template/page-template.jsx";
import SQLContent from "./SQLContent.jsx";

export default function SQLManage() {
  return (
    <PageTemplate
      headerTitle="조회 SQL 관리"
      panelBody={
        <>
          <SQLContent />
        </>
      }
    ></PageTemplate>
  );
}
