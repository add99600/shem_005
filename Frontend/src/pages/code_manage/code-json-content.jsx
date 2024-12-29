import CardTemplate from "../template/card-template";
import {
  InplaceEditorTemplate,
  TextBoxTemplate,
  TextAreaTemplate,
  apiCall,
  useAPI,
} from "hanawebcore-frontend";
import React, { useState, useEffect } from "react";
import AlertTemplate from "../template/alert-template";
import axios from "axios";

function CodeJsonContent() {
  const [selectedData, setSelectedData] = useState(null);
  const [ids, setIds] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [isPostSuccess, setIsPostSuccess] = useState(null);
  const [jsonContent, setJsonContent] = useState('');

  useEffect(() => {
    let postbody = {
      code: '점검대상',
    };
    axios
      .post('http://localhost:5000/api/search/code/minor', postbody)
      .then((response) => {
        const transformed = response.data.data.map((item) => {
          let jsonData = null;
          if (item.JSON_DATA) {
            try {
              jsonData = JSON.parse(item.JSON_DATA);
            } catch (error) {
              console.error('JSON parsing error for', item.DATA2, ':', error);
            }
          }
          return {
            text: item.DATA2,
            value: item.ID,
            json: jsonData,
          };
        });
        
        const textArray = transformed.map(item => item.text);
        setIds(textArray);
        setTransformedData(transformed);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const registhandleSave = async () => {
    if (!selectedData) {
      setIsPostSuccess(false);
      return;
    }

    try {
      // JSON 문자열이 유효한지 확인
      const parsedJson = JSON.parse(jsonContent);

      const { response } = await apiCall({
        endpoint: `${process.env.REACT_APP_BACK_HOST}/api/shem/gcm_code_data`,
        method: "put",
        payload: { 
          DATA2: selectedData.text,  // 선택된 작업공구의 ID
          JSON_DATA: jsonContent       // 수정된 JSON 데이터
        },
        id: selectedData.text
      });

      if (response && response.status === 200) {
        setIsPostSuccess(true);
        
        // 저장 성공 시 transformedData 업데이트
        setTransformedData(prev => 
          prev.map(item => 
            item.value === selectedData.value 
              ? { ...item, json: parsedJson }
              : item
          )
        );
      } else {
        setIsPostSuccess(false);
      }
    } catch (error) {
      console.error('Save error:', error);
      setIsPostSuccess(false);
    }
  };

  const actionSuccess = (e) => {
    const selected = transformedData.find(item => item.text === e.value);
    if (selected) {
      setSelectedData(selected);
      setJsonContent(
        selected.json 
          ? JSON.stringify(selected.json, null, 2) 
          : JSON.stringify({
              "checkList": [
                {
                  "id": 1,
                  "question": "새로운 체크리스트 항목",
                  "companyCheck": {
                    "status": null,
                    "comment": ""
                  },
                  "managerCheck": {
                    "status": null,
                    "comment": ""
                  }
                }
              ]
            }, null, 2)
      );
    }
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
          <div className="d-flex align-items-center mb-5">
            <p className="mb-0 col-md-1">작업공구 선택</p>
            <div className="col-md-11">
              <InplaceEditorTemplate
                dataSource={ids}
                actionSuccess={actionSuccess}
              />
            </div>
          </div>
          
          {selectedData && (
            <div className="mb-5">
              <p className="mb-2">체크리스트 JSON 편집</p>
              <TextAreaTemplate
                value={jsonContent}
                onChange={(e) => setJsonContent(e.value)}
                rows={20}
                style={{ fontFamily: 'monospace' }}
              />
              <div className="mt-3">
                <button 
                  className="btn btn-primary"
                  onClick={registhandleSave}
                >
                  저장
                </button>
              </div>
            </div>
          )}
        </>
      }
    />
  );
}

export default CodeJsonContent;