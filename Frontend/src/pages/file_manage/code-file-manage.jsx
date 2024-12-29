import PageTemplate from "../template/page-template.jsx";
import CodeFileContent from "./code-file-content.jsx";

function CodeFileManage() {
  return (
    <PageTemplate
      headerTitle="파일코드관리"
      panelBody={
        <>
          <CodeFileContent />
        </>
      }
    ></PageTemplate>
  );
}

export default CodeFileManage;
