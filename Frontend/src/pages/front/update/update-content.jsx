import React, { useState, useEffect } from "react";
import { useAPI } from "hanawebcore-frontend";
import DangerRender from "./update-dangerouslyRender";
import { Helmet } from "react-helmet";

function PageContent({ menuId, table, id }) {
  // 상태 관리
  const [htmlString, setHtmlString] = useState("");
  const [cssContent, setCssContent] = useState(null);
  const [menuType, setMenuType] = useState(null);
  const [isAllDataReady, setIsAllDataReady] = useState(false);
  const [componentData, setComponentData] = useState({});

  // API 호출
  const { response: data_response, loading: data_loading } = useAPI(
    `${process.env.REACT_APP_BACK_HOST}/api/load/${table}/${id}`,
    "get"
  );

  const { response: response_manage, loading: loading_manage } = useAPI(
    `${process.env.REACT_APP_BACK_HOST}/api/shem/REGIST_SQL_MANAGE`,
    "get"
  );

  const { response: board_response, loading: board_loading } = useAPI(
    `${process.env.REACT_APP_BACK_HOST}/api/shem/BOARD_COMPONENT`,
    "get"
  );

  // 모든 데이터가 준비되었는지 확인
  useEffect(() => {
    const allDataLoaded =
      !data_loading &&
      !loading_manage &&
      !board_loading &&
      data_response &&
      response_manage &&
      board_response;

    if (allDataLoaded) {
      // menuType 설정
      const matchedMenu = response_manage.data.find(
        (item) => item.MENU_ID === menuId
      );
      if (matchedMenu) {
        setMenuType(matchedMenu.TEMPLATE_ID);
      }

      // HTML과 CSS 설정
      if (board_response.success && board_response.data && matchedMenu) {
        const searchSqlData = board_response.data.find(
          (item) => item.TEMPLATE_ID === matchedMenu.TEMPLATE_ID
        );
        if (searchSqlData) {
          setHtmlString(searchSqlData.HTML);
          setCssContent(searchSqlData.CSS);
        }
      }

      setIsAllDataReady(true);
    }

    if (data_response?.data) {
      const dbData = data_response.data;
      console.log("dbData:", dbData);
      const mappedData = {};

      Object.entries(dbData).forEach(([key, value]) => {
        if (value !== null) {
          // 객체인 경우 JSON 문자열로 변환
          if (typeof value === "object" && !Array.isArray(value)) {
            mappedData[`data_${key.toLowerCase()}`] = JSON.stringify(value);
          }
          // 배열인 경우
          else if (Array.isArray(value)) {
            mappedData[`data_${key.toLowerCase()}`] = JSON.stringify(value);
          }
          // 날짜 처리
          else if (key.endsWith("_DT")) {
            mappedData[`data_${key.toLowerCase()}`] = new Date(value)
              .toISOString()
              .split("T")[0];
          }
          // 기본 문자열 처리
          else {
            mappedData[`data_${key.toLowerCase()}`] = value.toString().trim();
          }
        }
      });

      console.log("Mapped Data:", mappedData);
      setComponentData(mappedData);
    }
  }, [
    data_loading,
    loading_manage,
    board_loading,
    data_response,
    response_manage,
    board_response,
    menuId,
  ]);

  // 로딩 상태 표시
  if (!isAllDataReady || data_loading || loading_manage || board_loading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
      </div>
    );
  }

  // 모든 데이터가 준비된 후 렌더링
  return (
    <>
      <Helmet>
        <style type="text/css">{cssContent}</style>
      </Helmet>
      <div id="search-results" className="section-container">
        <div id="bsSpyContent" className="px-5 bg-white container-fluid h-100">
          <div className="p-3 bg-white search-container h-100">
            <DangerRender
              htmlString={htmlString}
              menuId={menuId}
              componentData={componentData}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default PageContent;
