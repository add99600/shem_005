import React, { useState, useEffect } from "react";
import {
  InplaceEditorTemplate,
  TextBoxTemplate,
  TextAreaTemplate,
  useAPI,
  apiCall,
} from "hanawebcore-frontend";
import CardTemplate from "../template/card-template";

function UpdateSQLContent() {
  const [insertSQL, setInsertSQL] = useState("");
  const [updateSQL, setUpdateSQL] = useState("");
  const [deleteSQL, setDeleteSQL] = useState("");
  const [sqlId, setSqlId] = useState("");
  const [sqlData, setSqlData] = useState({});
  const [ids, setIds] = useState([]);

  const { response, loading, HttpGetError } = useAPI(
    `${process.env.REACT_APP_BACK_HOST}/api/shem/regist_sql`,
    "get"
  );

  useEffect(() => {
    if (response && response.data) {
      setIds(response.data.map((item) => item.REGIST_ID));
    }
  }, [response, loading, response.data]);

  const actionSuccess = (e) => {
    const searchSqlData = response.data.find(
      (item) => item.REGIST_ID === e.value
    );
    setSqlData(searchSqlData);
  };

  const handleSave = async () => {
    let newSqlData = {
      regist_id: sqlId || sqlData?.REGIST_ID,
      description: sqlData?.DESCRIPTION,
      insert_sql: insertSQL || sqlData?.INSERT_SQL,
      update_sql: updateSQL || sqlData?.UPDATE_SQL,
      delete_sql: deleteSQL || sqlData?.DELETE_SQL,
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_HOST}/api/gcm/regist_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: newSqlData,
        }),
      });
  
      if (response.ok) {
        alert('저장되었습니다.');
        // 필요한 경우 데이터 새로고침
      } else {
        alert('저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleUpdate = async () => {
    let newSqlData = {
      regist_id: sqlId || sqlData?.REGIST_ID,
      description: sqlData?.DESCRIPTION,
      insert_sql: insertSQL || sqlData?.INSERT_SQL,
      update_sql: updateSQL || sqlData?.UPDATE_SQL,
      delete_sql: deleteSQL || sqlData?.DELETE_SQL,
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_HOST}/api/gcm/regist_sql`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: newSqlData,
        }),
      });
  
      if (response.ok) {
        alert('저장되었습니다.');
        // 필요한 경우 데이터 새로고침
      } else {
        alert('저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const rows = 20;

  return (
    <CardTemplate
      CardBody={
        <>
          <div className="col-md-12 control-section">
            <div className="d-flex align-items-center mb-5">
              <p className="mb-0 col-md-1">SQL ID 검색</p>
              <div className="col-md-11">
                <InplaceEditorTemplate
                  dataSource={ids}
                  actionSuccess={actionSuccess}
                />
              </div>
            </div>
            <div className="d-flex align-items-center mb-3">
              <p className="mb-0 col-md-1">신규SQL 생성 ID</p>
              <div className="col-md-11">
                <input
                  placeholder="신규 SQL ID를 생성할 때만 작성"
                  onChange={(e) => setSqlId(e.target.value)}
                />
              </div>
            </div>
            <div className="d-flex align-items-center mb-5">
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
            <div className="d-flex justify-content-between">
              <div className="col-md-4 pe-3">
                <TextAreaTemplate
                  placeholder="입력 SQL 작성"
                  rows={rows}
                  value={sqlData?.INSERT_SQL}
                  onChange={(e) => setInsertSQL(e.value)}
                />
              </div>
              <div className="col-md-4 pe-3">
                <TextAreaTemplate
                  placeholder="수정 SQL 작성"
                  rows={rows}
                  value={sqlData?.UPDATE_SQL}
                  onChange={(e) => setUpdateSQL(e.value)}
                />
              </div>
              <div className="col-md-4">
                <TextAreaTemplate
                  placeholder="삭제 SQL 작성"
                  rows={rows}
                  value={sqlData?.DELETE_SQL}
                  onChange={(e) => setDeleteSQL(e.value)}
                />
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-start mt-3">
              <button className="btn btn-primary" onClick={handleSave}>
                저장
              </button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                수정
              </button>
            </div>
          </div>
        </>
      }
    ></CardTemplate>
  );
}

export default UpdateSQLContent;
