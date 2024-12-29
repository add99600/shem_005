import React, { useState } from "react";
import {
  InplaceEditorTemplate,
  TextAreaTemplate,
  useAPI,
  apiCall,
} from "hanawebcore-frontend";
import CardTemplate from "../template/card-template";
import { makeIds } from "../../utils/arrayUtil";
import beautify from 'js-beautify';

function HtmlContent() {
    const [modelId, setModelId] = useState("");
    const [updateHtml, setUpdateHtml] = useState("");
    const [updateCss, setUpdateCss] = useState("");

    const [Html, setHtml] = useState("");
    const [Css, setCss] = useState("");

    const {
        response: getResponse,
        loading,
        error: HttpGetError,
    } = useAPI(
        `${process.env.REACT_APP_BACK_HOST}/api/shem/BOARD_COMPONENT`,
        "get"
    );

    const ids = getResponse ? makeIds(getResponse.data, "ID") : [];

    const actionSuccess = (e) => {
        if (e.value === "") {
          setModelId("");
          return;
        }

        const templateData = getResponse.data.find((item) => item.ID === e.value);

        setModelId(templateData.ID); // 템플릿 ID
    
        // html, css 로드 및 포맷
        const formattedHtml = beautify.html(templateData.HTML);
        const formattedCss = beautify.css(templateData.CSS);

        setHtml(formattedHtml);
        setCss(formattedCss);
    }

    const handleUpdate = () => {
        let Data = {
          html: updateHtml,
          css: updateCss,
        };
        const { response, loading, error } = apiCall({
          endpoint: `${process.env.REACT_APP_BACK_HOST}/api/gcm/BOARD_COMPONENT`,
          method: "put",
          payload: Data,
          id: modelId
        });
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
                  value={modelId}
                  actionSuccess={actionSuccess}
                />
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="col-md-6 pe-4">
                <TextAreaTemplate
                  placeholder="HTML 수정"
                  rows={rows}
                  value={Html}
                  onChange={(e) => setUpdateHtml(e.value)}
                />
              </div>
              <div className="col-md-6 pe-4">
                <TextAreaTemplate
                  placeholder="CSS 수정"
                  rows={rows}
                  value={Css}
                  onChange={(e) => setUpdateCss(e.value)}
                />
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-start mt-3">
              <button className="btn btn-primary" onClick={handleUpdate}>
                저장
              </button>
            </div>
          </div>
        </>
      }
    ></CardTemplate>
  );
}

export default HtmlContent;
