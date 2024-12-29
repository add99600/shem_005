import CardTemplate from "../template/card-template";
import React, { useState, useEffect } from "react";
import { InplaceEditorTemplate, TextBoxTemplate } from "hanawebcore-frontend";
import GrapesBuilder, {
  getHtmlAndCss,
  setProjectJson,
} from "hanawebcore-grapesbuilder";
import { apiCall } from "hanawebcore-frontend";
import { useAPI } from "hanawebcore-frontend";
import { makeIds } from "../../utils/arrayUtil";
import axios from "axios";
function MakeGrapesContent() {
  // 신규ID 추가
  const [sqlId, setSqlId] = useState("");
  const [description, setDescription] = useState("");
  const [editor, setEditor] = useState(null);
  const [modelId, setModelId] = useState("");

  const styles = [
    `${process.env.REACT_APP_URL}/styles/tailwindcss.namespaced.css`,
  ];

  const {
    response: getResponse,
    loading,
    error: HttpGetError,
  } = useAPI(
    `${process.env.REACT_APP_BACK_HOST}/api/shem/BOARD_COMPONENT`,
    "get"
  );

  const ids = getResponse ? makeIds(getResponse.data, "TEMPLATE_ID") : [];

  const actionSuccess = (e) => {
    if (e.value === "") {
      setModelId("");
      return;
    }

    const templateData = getResponse.data.find(
      (item) => item.TEMPLATE_ID === e.value
    );

    setModelId(templateData.TEMPLATE_ID); // 템플릿 ID
    setDescription(templateData.DESCRIPTION); // 템플릿 설명

    // 템플릿 로드
    if (templateData.PROJECT_DATA) {
      setProjectJson(templateData.PROJECT_DATA);
    }
  };

  const handleSave = async () => {
    let _sqlId = modelId;
    let _method = "put";

    console.log("sqlId", sqlId);

    if (sqlId !== "") {
      _sqlId = sqlId;
      _method = "post";
    }

    console.log("editor state:", editor);
    const grapesResult = await getHtmlAndCss();
    console.log("grapesResult:", grapesResult);

    // grapesResult가 유효한지 확인
    if (!grapesResult || !grapesResult.html) {
      alert("HTML 내용을 가져올 수 없습니다.");
      return;
    }

    // script 태그가 없는 경우를 처리
    const scriptContent = grapesResult.html.includes("<script>")
      ? grapesResult.html.match(/(<script>[\s\S]*?<\/script>)/)[1]
      : "";

    // script 태그가 있든 없든 HTML 정리
    const cleanedHtml = grapesResult.html.replace(
      /<script[\s\S]*?<\/script>/g,
      ""
    );

    const newProjectJson = grapesResult.projectJson;

    let newSqlData = {
      TEMPLATE_ID: _sqlId,
      DESCRIPTION: description,
      HTML: cleanedHtml,
      CSS: grapesResult.css,
      JAVASCRIPT: scriptContent,
      PROJECT_DATA: JSON.stringify(newProjectJson),
    };
    const table = "BOARD_COMPONENT";
    const url = `${process.env.REACT_APP_BACK_HOST}/api/shem/${table}`;

    try {
      await apiCall({
        endpoint: url,
        method: _method,
        payload: newSqlData,
        id: newSqlData.TEMPLATE_ID,
      });
      alert("저장되었습니다.");
    } catch (error) {
      alert("저장에 실패하였습니다.");
    }
  };

  useEffect(() => {
    if (editor) {
      // 저장된 데이터를 불러오는 로직
      editor.load((res) => {
        console.log("Loaded data:", res);
      });
    }
  }, [editor]);

  return (
    <CardTemplate
      CardBody={
        <>
          <div className="col-lg-12 control-section">
            <div class="d-flex align-items-center mb-5">
              <p class="mb-0 col-md-1">템플릿 ID</p>
              <div class="col-md-11">
                <InplaceEditorTemplate
                  dataSource={ids}
                  value={modelId}
                  actionSuccess={actionSuccess}
                />
              </div>
            </div>
            <div class="d-flex align-items-center mb-5">
              <p class="mb-0 col-md-1">신규 템플릿 ID</p>
              <div class="col-md-11">
                <input
                  placeholder="신규 템플릿 ID"
                  onChange={(e) => setSqlId(e.target.value)}
                />
              </div>
            </div>
            <div class="d-flex align-items-center mb-3">
              <p class="mb-0 col-md-1">템플릿 설명</p>
              <div class="col-md-11">
                <input
                  placeholder="모델 설명"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div class="d-flex align-items-center mb-3">
              <p class="mb-0 col-md-1">저장</p>
              <div class="col-md-11">
                <button class="btn btn-primary" onClick={handleSave}>
                  저장
                </button>
              </div>
            </div>
            <div className="col-md-12 vh-70">
              <GrapesBuilder initialStyles={styles} />
            </div>
          </div>
        </>
      }
    ></CardTemplate>
  );
}

export default MakeGrapesContent;
