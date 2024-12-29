import CardTemplate from "../template/card-template";
import {
  InplaceEditorTemplate,
  TextBoxTemplate,
  GridTemplate,
  useAPI,
  apiCall,
} from "hanawebcore-frontend";
import React, { useState, useEffect } from "react";
import { makeIds } from "../../utils/arrayUtil";
import AlertTemplate from "../template/alert-template";

function MenuContent() {
  // 사용테이블 MENU_MODEL

  const _header = {
    LANGUAGE: { headerText: "언어" },
    MENU_TYPE: { headerText: "템플릿ID" },
    CHECK_SQL1: { headerText: "조회쿼리1" },
    REGIST_MODEL_ID: { headerText: "모델ID 1" },
    CHECK_SQL2: { headerText: "조회쿼리2" },
  };

  const [modelData, setModelData] = useState({});
  const [modelArrayData, setModelArrayData] = useState([]);
  const [isPutSuccess, setIsPutSuccess] = useState(null);
  const [newId, setNewId] = useState("");

  const handleSave = async () => {
    // Grid의 모든 데이터의 설명을 바꾸고 PUT 요청을 보냅니다.
    const promises = modelArrayData.map(async (data) => {
      data.MODEL_DESC = modelData.MODEL_DESC;

      const { response, loading, error } = await apiCall({
        endpoint: `${process.env.REACT_APP_BACK_HOST}/api/shem/menu_regist_manage`,
        method: "put",
        payload: data,
        id: data.ID,
      });

      if (response && response.status === 200) {
        return true;
      } else {
        return false;
      }
    });

    const results = await Promise.all(promises);
    setIsPutSuccess(results.every((result) => result));
  };

  const {
    response: getResponse,
    loading,
    error: HttpGetError,
  } = useAPI(
    `${process.env.REACT_APP_BACK_HOST}/api/shem/menu_regist_manage`,
    "get"
  );

  // response.data 배열에서 ID를 추출하여 배열로 만듭니다.
  // 모델의 컬럼 정의가 여러 개가 있기 때문에 그룹화된 ID를 사용합니다.
  const ids = getResponse ? makeIds(getResponse.data, "MENU_ID") : [];

  // InplaceEditor 조회 시 호출되는 함수
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

  // Grid의 actionBegin 함수
  const actionBegin = (e) => {
    // console.log(e); // 이벤트 객체 참고

    if (e.requestType === "save" && e.action === "add") {
      const data = e.data;

      data.MODEL_ID = modelData.MODEL_ID;

      const { response, loading, error } = apiCall({
        endpoint: `${process.env.REACT_APP_BACK_HOST}/api/shem/menu_regist_manage`,
        method: "post",
        payload: data,
        id: null,
      });
    }

    if (e.requestType === "save" && e.action === "edit") {
      const data = e.data;
      const { response, loading, error } = apiCall({
        endpoint: `${process.env.REACT_APP_BACK_HOST}/api/shem/menu_regist_manage`,
        method: "put",
        payload: data,
        id: data.ID,
      });
    }
  };

  return (
    <CardTemplate
      CardBody={
        <>
          {isPutSuccess !== null && (
            <AlertTemplate
              show={isPutSuccess !== null}
              title={isPutSuccess ? "저장성공" : "저장실패"}
              message={
                isPutSuccess
                  ? "데이터가 성공적으로 저장되었습니다."
                  : "데이터가 성공적으로 저장되지 않았습니다."
              }
              alertType={isPutSuccess ? "success" : "danger"}
            />
          )}
          <div className="col-lg-12 control-section">
            <div class="d-flex align-items-center mb-5">
              <p class="mb-0 col-md-1">메뉴 ID 검색</p>
              <div class="col-md-11">
                <InplaceEditorTemplate
                  dataSource={ids}
                  value={modelData?.MENU_ID}
                  actionSuccess={actionSuccess}
                />
              </div>
            </div>
            <div class="d-flex align-items-center mb-3">
              <p class="mb-0 col-md-1">메뉴 설명</p>
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
            <div class="d-flex align-items-center justify-content-end">
              <button class="btn btn-primary" onClick={handleSave}>
                저장
              </button>
            </div>
            <div class="">
              <p class="">필드정보</p>
              {Object.keys(modelArrayData).length !== 0 ? ( // modelArrayData 빈 배열이 아닐 때만 GridTemplate을 렌더링합니다.
                <GridTemplate
                  headerBackgroundColor="var(--bs-gray-900)"
                  data={modelArrayData}
                  useCheckBox={false}
                  actionBegin={actionBegin}
                  header={_header}
                  hiddenColumns={[
                    "SETTINGS",
                    "ID",
                    "MENU_USE",
                    "CHECK_DESCRIPT",
                    "ISRT_DT",
                    "UPDT_DT",
                    "DELETE_DT",
                    "DELETED",
                  ]}
                />
              ) : (
                // modelData가 useState 초기 값으로 빈 객체일 때는 Default 렌더링
                <GridTemplate
                  headerBackgroundColor="var(--bs-gray-900)"
                  useCheckBox={false}
                />
              )}
            </div>
          </div>
        </>
      }
    ></CardTemplate>
  );
}

export default MenuContent;
