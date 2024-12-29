import React, { useEffect, useState } from "react";
import axios from "axios";
import CardTemplate from "../template/card-template";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { InPlaceEditorComponent, Inject, AutoComplete, ComboBox } from "@syncfusion/ej2-react-inplace-editor";

import { GridTemplate, apiCall, } from "hanawebcore-frontend";

function CodeStrContent() {
  const [MenuData, setMenuData] = useState([]);
  const [dropDownData, setdropDownData] = useState([]);
  const [MinorData, setMinorData] = useState([]);
  const [ColumnData, setColumnData] = useState([]);
  const [addedData, setAddedData] = useState([]); 
  const [selectedRows, setSelectedRows] = useState([]); // 체크한 데이터


  // 코드분류 리스트 불러오기
  useEffect(() => {
    axios.post("http://localhost:5000/api/search/code")
      .then((response) => {
        if (response.data.success) {
          setMenuData(response.data.menu);
        }
      })
      .catch((error) => {
        console.error("서버 요청 실패:", error);
      });
  }, []);

  let comboBoxModel = { dataSource: dropDownData, placeholder: "코드를 검색" };

  const handleSave = () => {
    console.log('저장 클릭')
    let body = {
      data: addedData, // 추가된 데이터만 전송
      menu: selectedMenu,
      code: selectedCode
    };
    axios.post("http://localhost:5000/api/add/code", body)
      .then((response) => {
        if (response.data.success) {
          alert("저장되었습니다.");
          setAddedData([]); // 저장 후 추가된 데이터 초기화
        }
      })
      .catch((error) => {
        console.error("서버 요청 실패:", error);
      });
  };

  const handleDelete = () => {
    console.log('삭제 클릭');
    let body = {
      data: selectedRows, 
      menu: selectedMenu,
      code: selectedCode
    };
    console.log('삭제 데이터',body)
    axios.delete("http://localhost:5000/api/delete/code", { data: body })
      .then((response) => {
        if (response.data.success) {
          alert("삭제되었습니다.");
          setSelectedRows([]); // 행 초기화
        }
      })
      .catch((error) => {
        console.error("서버 요청 실패:", error);
      });
  };

  const [selectedMenu, setSelectedMenu] = useState(null);
  const handleMenuChange = (e) => {
    setSelectedMenu(e.value);
  };

  useEffect(() => {
    if (selectedMenu) {
      // 선택된 값이 있을 때 요청
      axios.post("http://localhost:5000/api/search/bottom/menu", { code: selectedMenu })
        .then((response) => {
          let key = Object.keys(response.data.data);
          setdropDownData(key);
        })
        .catch((error) => {
          console.error("서버 요청 실패:", error);
        });
    }
  }, [selectedMenu]); // selectedCode 상태가 변경될 때마다 실행

  const [selectedCode, setSelectedCode] = useState(null);
  const handleCodeChange = (e) => {
    setSelectedCode(e.value);
  };

  useEffect(() => {
    if (selectedCode) {
      // 선택된 값이 있을 때 요청
      axios.post("http://localhost:5000/api/search/code/minor", { code: selectedCode })
        .then((response) => {        
          const formattedData = response.data.data
          console.log(formattedData);
          setColumnData(response.data.column)

          // value 값만 추출
          const valueData = formattedData.map(item => 
            Object.entries(item)
              .filter(([key, _]) => !['top_menu', 'data1', 'id'].includes(key))
              .map(([_, value]) => value)
          )
          console.log(valueData);
          
          setMinorData(valueData);
        })
        .catch((error) => {
          console.error("서버 요청 실패:", error);
        });
    }
  }, [selectedCode]); // selectedCode 상태가 변경될 때마다 실행


  // 그리드 이벤트 처리
  const actionBegin = (e) => {
    console.log(e); // 이벤트 객체

    if (e.requestType === "save" && e.action === "add") {
      const data = e.data;

      const { response, loading, error } = apiCall(
        "/api/update/code",
        "post",
        data,
      );
    }

    if (e.requestType === "save" && e.action === "edit") {
      const data = e.data;
      const id = e.data.id
      let body = {
        SelectData: selectedMenu,
        SelectCode: selectedCode,
        Data: data,
        Id: id
      }
      const { response, loading, error } = apiCall(
        "/api/update/code",
        "put",
        body,
      );
    }
  };

  return (
    <CardTemplate
      CardBody={
        <>
          <div className="row d-flex">
            <div className="col-lg-2 control-section me-5">
              <h4>사용카테고리</h4>
              <DropDownListComponent id="ddlelement" dataSource={MenuData} change={handleMenuChange} />
            </div>

            <div className="col-lg-2 control-section">
              <h4>코드분류</h4>
              <InPlaceEditorComponent
                id="comboBoxEle"
                value={selectedCode}
                model={comboBoxModel}
                type="ComboBox"
                mode="Inline"
                change={handleCodeChange}
              >
                <Inject services={[AutoComplete, ComboBox]} />
              </InPlaceEditorComponent>
            </div>
          </div>
          <div class="">
              <p class="">{selectedCode}</p>
              {MinorData.length !== 0 ? ( // GridTemplate을 렌더링합니다.
                <GridTemplate
                  headerBackgroundColor="var(--bs-gray-900)"
                  header={ColumnData}
                  data={MinorData}
                  useCheckBox={false}
                  actionBegin={actionBegin}
                />
              ) : (
                // modelData가 빈 객체일 때는 Default 렌더링
                <GridTemplate
                  headerBackgroundColor="var(--bs-gray-900)"
                  header="empty"
                  useCheckBox={false}
                />
              )}
            </div>
        </>
      }
    />
  );
}

export default CodeStrContent;
