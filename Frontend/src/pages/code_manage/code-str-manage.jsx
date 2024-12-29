import PageTemplate from "../template/page-template.jsx";
import CodeStrContent from "./code-str-content.jsx";

function CodeStrManage() {
  return (
    <PageTemplate
      headerTitle="문자열 코드관리"
      panelBody={
        <>
          <CodeStrContent />
        </>
      }
    ></PageTemplate>
  );
}

export default CodeStrManage;
