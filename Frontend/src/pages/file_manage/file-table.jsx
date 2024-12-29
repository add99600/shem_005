import React, { useEffect, useState, useRef } from "react";
import CardTemplate from "../template/card-template";
import axios from "axios";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Sort,
  Inject,
  Toolbar,
  Filter,
  Edit,
} from "@syncfusion/ej2-react-grids";

const FileTable = ({ selectedMenu }) => {
  const [data, setData] = useState([]);
  const [prevData, setPrevData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  // 상위메뉴 리스트에서 선택한 데이터에 해당하는 데이터 서버에 요청
  useEffect(() => {
    axios.get(`http://localhost:5000/api/file/list/${selectedMenu}`)
      .then((response) => {
        console.log(response.data.data);
        setData(response.data.data);
        setPrevData(response.data.data); // 이전 상태 저장
      })
      .catch((error) => {
        console.error("서버 요청 실패:", error);
      });
  }, [selectedMenu]);

  // 파일 다운로드 템플릿
  const fileNameCellTemplate = (props) => {
    return (
      <a href='#' onClick={(event) => window.handleFileNameClick(event, props.NAME, props.TOP_MENU)}>
        {props.NAME}
      </a>
    );
  };

  const [uploadedFile, setUploadedFile] = useState(null);

  const handleUploadSuccess = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  const fileuploadtemplate = () => {
    return (
      <div>
        <input
          type="file"
          onChange={handleUploadSuccess}
        />
      </div>
      
    )
  }

  // 전역변수 파일명 클릭이벤트
  window.handleFileNameClick = (event, filename, topMenu) => {
    event.preventDefault();
    console.log(filename, topMenu);
    axios.get(`http://localhost:5000/api/download/${topMenu}/${filename}`, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("서버 요청 실패:", error);
      });
  };

  const gcm = [
    { field: "TEXT_NAME", headerText: "파일텍스트" },
    { field: "NUM", headerText: "순서" },
    { field: "DESCRIPTION", headerText: "설명" },
    { field: "TOP_MENU", headerText: "상위메뉴" },
    { field: "NAME", headerText: "파일명", template: fileNameCellTemplate, editTemplate: fileuploadtemplate },
  ]

  const toolbar = ["Add", "Edit", "Delete", "Update", "Cancel"];
  const editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };

  // 변경된 부분 추출 함수
  function getChangedData(newData, oldData, uploadedFile) {  // uploadedFile 매개변수 추가
    let changedData = {};
    
    // oldData가 없는 경우 처리
    if (!oldData) {
      console.error('이전 데이터를 찾을 수 없습니다:', newData);
      return newData;
    }

    // 모든 필드를 순회하면서 변경사항 확인
    for (let key in newData) {
      if (newData[key] !== oldData[key]) {
        changedData[key] = newData[key];
      }
    }

    // 파일이 변경된 경우 처리
    if (uploadedFile) {
      changedData.NAME = uploadedFile.name;
      changedData.file = uploadedFile;
    }

    // changedData에 직접 TOP_MENU 추가
    changedData.TOP_MENU = selectedMenu;

    console.log('변경된 데이터:', changedData);  // 디버깅용
    return changedData;
  }

  // 데이터 전송 함수
  async function sendData(data, file) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file) {
      formData.append('file', file);
    }

    await axios.post('http://localhost:5000/api/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        if(response.data.success){
          console.log(response.data)
        }
      })
      .catch((error) => {
        console.error('요청실패:', error);
      });
  }

  // 데이터 업데이트 함수
  async function updateData(data, file) {
    const oldData = prevData.find(item => item.ID === data.ID);
    const changedData = getChangedData(data, oldData, file);
    
    // file 객체는 changedData에서 제거 (FormData에 별도로 추가)
    const { file: fileObj, ...dataToSend } = changedData;
    
    const formData = new FormData();
    formData.append('data', JSON.stringify(dataToSend));  // file 제외한 데이터
    formData.append('id', data.ID);
    
    // 파일이 있는 경우 별도로 추가
    if (file) {
      formData.append('file', file);
    }

    console.log('전송 전 FormData 확인:');
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    await axios.put('http://localhost:5000/api/file/data/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        if(response.data.success){
          console.log('업데이트 성공:', response.data);
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
    await axios.delete('http://localhost:5000/api/file/data/delete', { params: delete_body })
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
  function handleActionComplete(args) {
    if (args.requestType === 'save') {
      if (uploadedFile) {
        args.data.NAME = uploadedFile.name;
        args.data.file = uploadedFile;  // rawFile 대신 전체 파일 객체 사용
      }
      if (args.action === 'add') {
        setIsAdding(false);
        sendData(args.data, uploadedFile).catch(console.error);
      } else if (args.action === 'edit') {
        updateData(args.data, uploadedFile).catch(console.error);  // uploadedFile 전달
      }
    } else if (args.requestType === 'delete') {
      deleteData(args.data).catch(console.error);
    }
    
    // 파일 선택 상태 초기화
    setUploadedFile(null);
  }

  return (
    <CardTemplate
      CardBody={
        <>
          {
            // 데이터가 존재할 때만 렌더링
            data && data.length > 0 && (
              <GridComponent
                dataSource={data}
                height="350"
                allowSorting={true}
                editSettings={editSettings}
                toolbar={toolbar}
                actionComplete={handleActionComplete}
              >
              <ColumnsDirective>
                {gcm.map((col, index) => {
                  return (
                    <ColumnDirective
                      key={index}
                      field={col.field}
                      headerText={col.headerText}
                      allowEditing={col.field === "NAME" ? isAdding : true} // 파일명 수정 불가 설정
                      template={col.template}
                      editTemplate={col.editTemplate}
                      type="string"
                    />
                  );
                })}
              </ColumnsDirective>
                <Inject services={[Sort, Toolbar, Filter, Edit]} />
              </GridComponent>
            )
          }
        </>
      }
    />
  );
};

export default FileTable;
