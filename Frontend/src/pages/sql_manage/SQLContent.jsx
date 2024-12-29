import CardTemplate from "../template/card-template";
import {
  InplaceEditorTemplate,
  TextBoxTemplate,
  TextAreaTemplate,
  useAPI,
  apiCall,
} from "hanawebcore-frontend";
import React, { useState } from "react";
import AlertTemplate from "../template/alert-template";

// axios 추가
import axios from "axios";

function SQLContent() {
  // 사용테이블 CHECK_SQL_MANAGE
  // fetch(endpoint, method = "get", payload = {}, id)
  const [sqlData, setSqlData] = useState({});
  const [isPostSuccess, setIsPostSuccess] = useState(null);

  const handleSave = async () => {
    let updatedSqlData = {
      description: sqlData?.DESCRIPTION,
      sql_detail: sqlData?.SQL_DETAIL,
    };

    try {
      await apiCall({
        endpoint: `${process.env.REACT_APP_BACK_HOST}/api/shem/CHECK_SQL_MANAGE`,
        method: "put",
        payload: updatedSqlData,
        id: sqlData.ID,
      }).then(() => {
        setIsPostSuccess(true);
      });
    } catch (error) {
      setIsPostSuccess(false);
    }
  };

  const { response, loading, HttpGetError } = useAPI(
    `${process.env.REACT_APP_BACK_HOST}/api/shem/CHECK_SQL_MANAGE`,
    "get"
  );

  // 신규 id 추가
  const [sqlId, setSqlId] = useState("");

  async function newSqlId() {
    let newSqlData = {
      id: sqlId,
      description: sqlData?.DESCRIPTION,
      sql_detail: sqlData?.SQL_DETAIL,
    };
    try {
      await apiCall({
        endpoint: `${process.env.REACT_APP_BACK_HOST}/api/gcm/check_sql_manage`,
        method: "post",
        payload: newSqlData,
      }).then(() => {
        setIsPostSuccess(true);
      });
    } catch (error) {
      setIsPostSuccess(false);
    }
  }

  // response 객체에서 ID를 추출하여 배열로 만듭니다.
  const ids = response ? response.data.map((item) => item.ID) : [];

  console.log(ids);

  // InplaceEditor 조회 시 호출되는 함수
  const actionSuccess = (e) => {
    const searchSqlData = response.data.find((item) => item.ID === e.value);
    setSqlData(searchSqlData);
  };

  return (
    <CardTemplate
      CardBody={
        <>
          {HttpGetError && (
            <AlertTemplate
              show={HttpGetError}
              title="에러"
              message="데이터를 불러오는데 실패했습니다."
              alertType="danger"
            />
          )}
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
          <div className="col-lg-12 control-section">
            <div class="d-flex align-items-center mb-5">
              <p class="mb-0 col-md-1">SQL ID 검색</p>
              <div class="col-md-11">
                <InplaceEditorTemplate
                  dataSource={ids}
                  value=""
                  actionSuccess={actionSuccess}
                />
              </div>
            </div>
            <div class="d-flex align-items-center mb-3">
              <p class="mb-0 col-md-1">신규SQL 생성 ID</p>
              <div class="col-md-11">
                <input
                  placeholder="신규 SQL ID를 생성할 때만 작성"
                  onChange={(e) => setSqlId(e.target.value)}
                />
              </div>
            </div>
            <div className="d-flex align-items-center mb-3">
              <p className="mb-0 col-md-1">SQL 설명</p>
              <div className="col-md-11">
                <input
                  placeholder="SQL 설명"
                  value={sqlData?.DESCRIPTION}
                  onChange={(event) => {
                    setSqlData({ ...sqlData, DESCRIPTION: event.target.value });
                  }}
                />
              </div>
            </div>
            <div class="d-flex align-items-center mb-3">
              <p class="mb-0 col-md-1">SQL 내용</p>
              <div class="col-md-11">
                <TextAreaTemplate
                  placeholder="SQL 내용"
                  rows={15}
                  value={sqlData?.SQL_DETAIL}
                  onChange={(event) =>
                    setSqlData({ ...sqlData, SQL_DETAIL: event.value })
                  }
                />
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-start">
              <button class="btn btn-primary" onClick={handleSave}>
                수정
              </button>
              <button class="btn btn-primary" onClick={newSqlId}>
                SQLID추가
              </button>
            </div>
          </div>
        </>
      }
    ></CardTemplate>
  );
}

export default SQLContent;
