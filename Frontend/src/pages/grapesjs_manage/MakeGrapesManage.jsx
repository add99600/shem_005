import PageTemplate from "../template/page-template.jsx";
import MakeGrapesContent from "./MakeGrapesContent.jsx";

function MakeGrapesManage() {
  return (
    <PageTemplate
      headerTitle="HTML 생성"
      panelBody={
        <>
          <MakeGrapesContent />
        </>
      }
    ></PageTemplate>
  );
}

export default MakeGrapesManage;
