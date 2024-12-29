import CardTemplate from "../template/card-template";
import {
  InplaceEditorTemplate,
  TextBoxTemplate,
  TextAreaTemplate,
  apiCall,
  useAPI,
} from "hanawebcore-frontend";
import React, { useState } from "react";
import AlertTemplate from "../template/alert-template";

function RegistSettingContent() {
  const [JsonData, setJsonData] = useState({
    SETTINGS: {},
  });

  const [isPostSuccess, setIsPostSuccess] = useState(null);

  const registhandleSave = async () => {
    console.log(JsonData);
    try {
      const { response } = await apiCall({
        endpoint: `${process.env.REACT_APP_BACK_HOST}/api/shem/REGIST_SQL_MANAGE`,
        method: "put",
        payload: { MENU_ID: JsonData.MENU_ID, SETTINGS: JsonData.SETTINGS },
      });

      if (response && response.status === 200) {
        setIsPostSuccess(true);
      } else {
        setIsPostSuccess(false);
      }
    } catch (error) {
      setIsPostSuccess(false);
    }
  };

  const { response, loading, HttpGetError } = useAPI(
    `${process.env.REACT_APP_BACK_HOST}/api/shem/REGIST_SQL_MANAGE`,
    "get"
  );

  const ids = response ? response.data.map((item) => item.MENU_ID) : [];

  // InplaceEditor 조회 시 호출되는 함수
  const actionSuccess = (e) => {
    const searchJsonData = response.data.find(
      (item) => item.MENU_ID === e.value
    );
    setJsonData(searchJsonData || { SETTINGS: {} });
  };

  return (
    <CardTemplate
      CardBody={
        <>
          {isPostSuccess !== null && (
            <AlertTemplate
              show={isPostSuccess !== null}
              title={isPostSuccess ? "저장성공" : "저장실패"}
              message={
                isPostSuccess
                  ? "데이터가 성공적으로 저장되었습니다."
                  : "데이터가 성공적으로 저장되지 않았습니다."
              }
              alertType={isPostSuccess ? "success" : "danger"}
            />
          )}
          <div class="d-flex align-items-center mb-5">
            <p class="mb-0 col-md-1">ID 검색</p>
            <div class="col-md-11">
              <InplaceEditorTemplate
                dataSource={ids}
                actionSuccess={actionSuccess}
              />
            </div>
          </div>

          <div class="d-flex align-items-center mb-3">
            <p class="mb-0 col-md-1">Settings</p>
            <div class="col-md-11">
              <TextAreaTemplate
                placeholder="Settings Json"
                rows={15}
                value={JSON.stringify(JsonData.SETTINGS, {}, 2)}
                onChange={(event) => {
                  try {
                    const parsedSettings = JSON.parse(event.value);
                    setJsonData((prevState) => ({
                      ...prevState,
                      SETTINGS: parsedSettings,
                    }));
                  } catch (error) {
                    console.error("Invalid JSON format:", error);
                  }
                }}
              />
            </div>
          </div>
          <div class="d-flex align-items-center justify-content-end">
            <button class="btn btn-primary" onClick={registhandleSave}>
              저장
            </button>
          </div>
        </>
      }
    ></CardTemplate>
  );
}

export default RegistSettingContent;
