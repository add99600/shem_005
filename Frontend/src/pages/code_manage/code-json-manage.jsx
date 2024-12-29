import PageTemplate from "../template/page-template.jsx";
import CodeJsonContent from "./code-json-content.jsx";

function CodeJsonManage() {
  return (
    <PageTemplate
      headerTitle="json 코드관리"
      panelBody={
        <>
          <CodeJsonContent />
        </>
      }
    ></PageTemplate>
  );
}

export default CodeJsonManage;
