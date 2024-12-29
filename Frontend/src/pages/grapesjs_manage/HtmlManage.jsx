import PageTemplate from "../template/page-template.jsx";
import HtmlContent from "./HtmlContent.jsx";

function HtmlManage() {
  return (
    <PageTemplate
      headerTitle="HTML 관리"
      panelBody={
        <>
          <HtmlContent />
        </>
      }
    ></PageTemplate>
  );
}

export default HtmlManage;
