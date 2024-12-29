import CardTemplate from "../template/card-template";
import { apiCall, GridTemplate, DataContext } from "hanawebcore-frontend";
import React, { useState, useContext } from "react";
import axios from "axios";

function SiteMenuContent() {
  const { responseData: gridData = [] } = useContext(DataContext) || {};

  const _header = {
    TOP_MENU: { headerText: "상위메뉴" },
    DATA1: { headerText: "메뉴유형" },
    DATA3: { headerText: "부모메뉴명" },
    DATA2: { headerText: "메뉴명" },
    DATA4: { headerText: "순서" },
    DATA5: { headerText: "메뉴URL" },
  };

  console.log('메뉴 데이터',gridData);

  const actionBegin = (e) => {
    console.log('이벤트',e); // 이벤트 객체 참고

    if (e.requestType === "save" && e.action === "add") {
      const data = {
        ...e.data,
        TOP_MENU: 'Front메뉴'  // TOP_MENU 자동 추가
      };

      const { response, loading, error } = apiCall({
        endpoint: `${process.env.REACT_APP_BACK_HOST}/api/gcm/gcm_code_data`,
        method: "post",
        payload: data,
        id: null,
        model: "MENU_MODEL",
      });
    }

    if (e.requestType === "save" && e.action === "edit") {
      const data = e.data;
      const { response, loading, error } = apiCall({
        endpoint: `${process.env.REACT_APP_BACK_HOST}/api/gcm/gcm_code_data`,
        method: "put",
        payload: data,
        id: data.ID,
      });
    }

    if (e.requestType === "delete") {
      const data = e.data[0];
      console.log('삭제할 데이터:', data);
      
      try {
        const response = axios.delete(
          `${process.env.REACT_APP_BACK_HOST}/api/gcm/gcm_code_data`, 
          {
            data: {  // req.body로 전달하기 위해 data 객체 사용
              data: data  // 또는 JSON.stringify(data)
            }
          }
        );
        
        if (response.status === 200) {
          console.log('삭제 성공');
        }
      } catch (error) {
        console.error('삭제 실패:', error);
        console.error('에러 상세:', error.response?.data);
      }
    }
  };

  return (
    <CardTemplate
      CardBody={
        <>
          <div className="col-md-12 control-section">
            <GridTemplate
              headerBackgroundColor="var(--bs-gray-900)"
              data={gridData}
              useCheckBox={false}
              allowRowDragAndDrop={false}
              actionBegin={actionBegin}
              header={_header}
              hiddenColumns={['TOP_MENU']}
            />
          </div>
        </>
      }
    ></CardTemplate>
  );
}

export default SiteMenuContent;
