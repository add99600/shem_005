import PageTemplate from "../template/page-template.jsx";
import TableManageContent from "./table-manage-content.jsx";

function TableManage() {

  return (
    <PageTemplate
      headerTitle="GCM SetUp"
      panelBody={
        <>
          <TableManageContent />
        </>
      }
    ></PageTemplate>
  );
}

export default TableManage;