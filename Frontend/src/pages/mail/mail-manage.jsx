import PageTemplate from "../template/page-template.jsx";
import MailContent from "./mail-content.jsx";

function MailManage() {
  return (
    <PageTemplate
      headerTitle="메일 템플릿 관리"
      panelTitle="Mail Merge"
      cssClass="vh-80"
      panelBody={
        <>
          <MailContent />
        </>
      }
    ></PageTemplate>
  );
}

export default MailManage;
