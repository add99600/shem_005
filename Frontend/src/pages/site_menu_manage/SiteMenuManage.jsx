import PageTemplate from "../template/page-template.jsx";
import SiteMenuContent from "./SiteMenuContent.jsx";
import { DataManager } from "hanawebcore-frontend";

function SiteMenuManage() {
  return (
    <DataManager
      endpoint="http://localhost:5000/api/gcm/gcm_code_data"
      requesttype="get"
      where={{
        TOP_MENU: "Front메뉴",
      }}
    >
      <PageTemplate
        headerTitle="환경안전포탈 메뉴관리"
        panelBody={<SiteMenuContent />}
      ></PageTemplate>
    </DataManager>
  );
}

export default SiteMenuManage;
