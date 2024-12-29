import React, { useEffect, useState } from "react";
import CardTemplate from "../template/card-template";
import axios from 'axios';
import { InPlaceEditorComponent, AutoComplete, ComboBox } from "@syncfusion/ej2-react-inplace-editor";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Sort,
  Toolbar,
  Filter,
  Edit,
} from "@syncfusion/ej2-react-grids";


function TableManageContent() {
  const [gcm, setGcm] = useState([]);
  const [dropDownData, setdropDownData] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [prevData, setPrevData] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    // 환경안전 테이블 리스트
    axios.get(`http://localhost:5000/api/get/table/list`)
      .then((response) => {
        if(response.data.success){
          console.log(response.data.data)
          setdropDownData(response.data.data);
        }
      })
     .catch((error) => {
        console.error('요청실패:', error);
      });
  },[]);


  useEffect(() => {
    if (selectedMenu) {
      axios.get(`http://localhost:5000/api/gcm/${selectedMenu}`)
        .then((response) => {
          if(response.data.success){
            setData(response.data.data);
            setGcm(response.data.column);
            setPrevData(response.data.data); // 이전 상태 저장
          }
        })
        .catch((error) => {
          console.error('요청실패:', error);
        });
    }
  }, [selectedMenu]);

  const toolbar = ["Add", "Edit", "Delete", "Update", "Cancel"];
  const editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };

  let comboBoxModel = { 
    dataSource: dropDownData, 
    placeholder: "코드를 검색" 
  };

  const handleMenuChange = (e) => {
    setSelectedMenu(e.value);
  };

    // 데이터 추가 함수
    async function sendData(data) {
      let send_body = {
        data: JSON.stringify(data)
      }
      await axios.post(`http://localhost:5000/api/gcm/${selectedMenu}`, send_body)
        .then((response) => {
          if(response.data.success){
            console.log(response.data)
          }
        })
      .catch((error) => {
          console.error('요청실패:', error);
        });
  }
    
  // 데이터 삭제 함수
  async function deleteData(data) {
    console.log(JSON.stringify(data[0]))
    let delete_body = {
      data: JSON.stringify(data[0])
    }
    await axios.delete(`http://localhost:5000/api/gcm/${selectedMenu}`, { params: delete_body})
      .then((response) => {
        if(response.data.success){
          console.log(response.data)
        }
      })
    .catch((error) => {
        console.error('요청실패:', error);
      });
  }  


  // 변경된 부분 추출 함수
  function getChangedData(newData, oldData) {
    let changedData = {};
    for (let key in newData) {
      if (newData[key] !== oldData[key]) {
        changedData[key] = newData[key];
      }
    }
    return changedData;
  }
  
  // 데이터 업데이트 함수
  async function updateData(data) {
    const changedData = getChangedData(data, prevData.find(item => item.id === data.id));
    let update_body = {
      data: JSON.stringify(data),
      id: data.ID
    }
    await axios.put(`http://localhost:5000/api/gcm/${selectedMenu}`, update_body)
      .then((response) => {
        if(response.data.success){
          console.log(response.data)
        }
      })
    .catch((error) => {
        console.error('요청실패:', error);
      });
  }

  // 버튼 클릭 이벤트 처리 함수
  async function handleActionComplete(args) {
    if (args.requestType === 'save') {
      if (args.action === 'add') {
        sendData(args.data).catch(console.error);
      } else if (args.action === 'edit') {
        updateData(args.data).catch(console.error);
      }
    } else if (args.requestType === 'delete') {
      deleteData(args.data).catch(console.error);
    }
  }

  return (
    <CardTemplate
      CardBody={
        <>
          <div className="col-lg-2 control-section">
            <h4>검색하기</h4>
              <InPlaceEditorComponent
                id="comboBoxEle"
                value={selectedMenu}
                model={comboBoxModel}
                change={handleMenuChange}
                type="ComboBox"
                mode="Inline"
              >
              <Inject services={[AutoComplete, ComboBox]} />
            </InPlaceEditorComponent>
          </div>

          {data && data.length > 0 ? (
          <GridComponent
              dataSource={data}
              height="350"
              allowSorting={true}
              editSettings={editSettings}
              toolbar={toolbar}
              actionComplete={handleActionComplete}
          >
              <ColumnsDirective>
              {gcm.map((column) => (
                  <ColumnDirective field={column} width='100'/>
              ))}
              </ColumnsDirective>
              <Inject services={[Sort, Toolbar, Filter, Edit]} />
          </GridComponent>
          ) : (
          <div>Loading...</div>
          )}
        </>
      }
    ></CardTemplate>
  );
}

export default TableManageContent;
