import React, { useState, useEffect } from "react";
import {
  InplaceEditorTemplate,
  TextBoxTemplate,
  GridTemplate,
  useAPI,
  apiCall,
} from "hanawebcore-frontend";
import CardTemplate from "../template/card-template";

function UpdateMenuContent() {
  const [ids, setIds] = useState([]);
  const [modelData, setModelData] = useState({});
  const [modelArrayData, setModelArrayData] = useState([]);

  const _header = {
    TEMPLATE_ID: { headerText: "템플릿ID" },
    SQL1: { headerText: "쿼리1" },
    SQL2: { headerText: "쿼리2" },
    SQL3: { headerText: "쿼리3" },
    SQL4: { headerText: "쿼리4" },
    SQL5: { headerText: "쿼리5" },
  };

  const {
    response: getResponse,
    loading,
    HttpGetError,
  } = useAPI(
    `${process.env.REACT_APP_BACK_HOST}/api/shem/REGIST_SQL_MANAGE`,
    "get"
  );

  useEffect(() => {
    if (getResponse && getResponse.data) {
      setIds(getResponse.data.map((item) => item.MENU_ID));
    }
  }, [getResponse, loading, getResponse.data]);

  const actionSuccess = (e) => {
    const newSqlData = getResponse.data.find(
      (item) => item.MENU_ID === e.value
    );

    const newArrayData = getResponse.data.filter(
      (item) => item.MENU_ID === e.value
    );

    setModelData(newSqlData); // 상단 Inplace Editor에서 사용
    setModelArrayData(newArrayData); // 하단 Grid에서 사용
  };

  const actionBegin = (e) => {
    // console.log(e); // 이벤트 객체 참고

    if (e.requestType === "save" && e.action === "add") {
      const data = e.data;

      data.MODEL_ID = modelData.MODEL_ID;

      const { response, loading, error } = apiCall({
        endpoint: `${process.env.REACT_APP_BACK_HOST}/api/shem/REGIST_SQL_MANAGE`,
        method: "post",
        payload: data,
        id: data.ID,
      });
    }

    if (e.requestType === "save" && e.action === "edit") {
      const data = e.data;
      const { response, loading, error } = apiCall({
        endpoint: `${process.env.REACT_APP_BACK_HOST}/api/shem/REGIST_SQL_MANAGE`,
        method: "put",
        payload: data,
        id: data.ID,
      });
    }
  };
  console.log("modelArrayData", modelArrayData);

  return (
    <CardTemplate
      CardBody={
        <>
          <div className="col-lg-12 control-section">
            <div class="d-flex align-items-center mb-5">
              <p class="mb-0 col-md-1">모델 ID 검색</p>
              <div class="col-md-11">
                <InplaceEditorTemplate
                  dataSource={ids}
                  value=""
                  actionSuccess={actionSuccess}
                />
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center mb-3">
            <p class="mb-0 col-md-1">모델 설명</p>
            <div class="col-md-11">
              <TextBoxTemplate
                placeholder="모델 설명"
                value={modelData?.MODEL_DESC}
                onChange={(event) => {
                  setModelData({ ...modelData, MODEL_DESC: event.value });
                }}
              />
            </div>
          </div>
          <div class="">
            <p class="">필드정보</p>
            {Object.keys(modelArrayData).length !== 0 ? ( // modelArrayData 빈 배열이 아닐 때만 GridTemplate을 렌더링합니다.
              <GridTemplate
                headerBackgroundColor="var(--bs-gray-900)"
                header={_header}
                data={modelArrayData}
                useCheckBox={false}
                actionBegin={actionBegin}
              />
            ) : (
              // modelData가 useState 초기 값으로 빈 객체일 때는 Default 렌더링
              <GridTemplate
                headerBackgroundColor="var(--bs-gray-900)"
                header="empty"
                useCheckBox={false}
              />
            )}
          </div>
        </>
      }
    ></CardTemplate>
  );
}

export default UpdateMenuContent;
