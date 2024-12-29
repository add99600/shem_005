import PageTemplate from "../template/page-template.jsx";
import GrapesContent from "./GrapesContent.jsx";

function GrapesManage() {
  return (
    <PageTemplate
      headerTitle="HTML 관리"
      panelBody={
        <>
          <GrapesContent />
        </>
      }
    ></PageTemplate>
  );
}

export default GrapesManage;
