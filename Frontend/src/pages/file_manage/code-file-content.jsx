import React, { useState, useEffect } from "react";
import axios from "axios";
import FileTable from "./file-table.jsx";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
// import FileUploadForm from "./file-upload-form.jsx"

function CodeFileContent() {
  // 상위메뉴 불러오기
  const [Bottom_Data, setBottom_Data] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/api/file/top/menu")
      .then((response) => {
        setBottom_Data(response.data.data);
      })
      .catch((error) => {
        console.error("서버 요청 실패:", error);
      });
  }, []);

  // selectedMenu = 선택된 상위메뉴
  const [selectedMenu, setSelectedMenu] = useState(null);
  const handleMenuChange = (e) => {
    setSelectedMenu(e.value);
  };

  return (
    <div>
      <div className="row d-flex">
        <div className="col-lg-2 control-section me-5">
          <h4>파일메뉴</h4>
          <DropDownListComponent id="ddlelement" dataSource={Bottom_Data} change={handleMenuChange} />
        </div>
      </div>

      <FileTable selectedMenu={selectedMenu}/>
    </div>
  );
}

export default CodeFileContent;
