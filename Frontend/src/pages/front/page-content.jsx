import React, { useState, useEffect } from "react";
import { useAPI } from "hanawebcore-frontend";
import DangerRender from "./dangerouslyRender";
import { GridTemplate } from "hanawebcore-frontend";
import { Helmet } from "react-helmet";

function PageContent({ menuId }) {
  const [htmlString, setHtmlString] = useState("");
  const [cssContent, setcssContent] = useState(null);

  const [MenuType, setMenuType] = useState(null);

  // Menu_REGIST_MANAGE 호출
  const { response: response_manage, loading: loading_manage } = useAPI(
    `${process.env.REACT_APP_BACK_HOST}/api/shem/MENU_REGIST_MANAGE`,
    "get"
  );

  useEffect(() => {
    if (!loading_manage) {
      // menu_id에 해당하는 정보 추출 -> 템플릿 id 추출
      const matchedMenu = response_manage.data.find(
        (item) => item.MENU_ID === menuId
      );
      setMenuType(matchedMenu.MENU_TYPE);
    }
  }, [response_manage, loading_manage]);

  // html, css, javascript 데이터 불러오기
  const { response, loading, HttpGetError } = useAPI(
    `${process.env.REACT_APP_BACK_HOST}/api/shem/BOARD_COMPONENT`,
    "get"
  );

  useEffect(() => {
    if (response && response.success && response.data) {
      console.log("MenuType", MenuType);
      console.log("response", response);
      const searchSqlData = response.data.find(
        (item) => item.TEMPLATE_ID === MenuType
      );
      setHtmlString(searchSqlData.HTML);
      setcssContent(searchSqlData.CSS);
    }
  }, [response, loading]);

  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <>
      <Helmet>
        <style type="text/css">{cssContent}</style>
        {/* <script type="text/javascript">{script}</script> */}
      </Helmet>
      <div id="bsSpyContent" class="px-5 bg-white section-container h-100">
        <div class="container-fluid">
          <div class="search-container bg-white p-4 h-100">
            <DangerRender htmlString={htmlString} menuId={menuId} />
          </div>
        </div>
      </div>
    </>
  );
}

export default PageContent;
