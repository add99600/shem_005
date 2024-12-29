import PageTemplate from "../template/page-template.jsx";
import MenuContent from "./MenuContent.jsx";

function MenuManage() {
  return (
    <PageTemplate
      headerTitle="전체 메뉴관리"
      panelBody={
        <>
          <MenuContent />
        </>
      }
    ></PageTemplate>
  );
}

export default MenuManage;
