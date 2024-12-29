import PageTemplate from "../template/page-template.jsx";
import ModelContent from "./ModelContent.jsx";
import { DataManager } from "hanawebcore-frontend";

function ModelManage() {
  return (
    <DataManager
      endpoint="http://localhost:5000/api/shem/MENU_MODEL"
      requesttype="get"
    >
      <PageTemplate
        headerTitle="등록 Model 관리"
        panelBody={
          <>
            <ModelContent />
          </>
        }
      ></PageTemplate>
    </DataManager>
  );
}

export default ModelManage;
