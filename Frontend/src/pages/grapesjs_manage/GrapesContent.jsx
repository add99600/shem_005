import CardTemplate from "../template/card-template";
import React, { useState, useEffect } from "react";
import { InplaceEditorTemplate, TextBoxTemplate } from "hanawebcore-frontend";
import GrapesBuilder, { getHtmlAndCss } from "hanawebcore-grapesbuilder";
import { apiCall } from "hanawebcore-frontend";
import {
  useAPI,
} from "hanawebcore-frontend";
import grapesjs from 'grapesjs';

import axios from "axios";
function GrapesContent() {
  // 신규ID 추가
  const [sqlId, setSqlId] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    // html content
    const grapesResult = getHtmlAndCss();

    const { html } = getHtmlAndCss();
    const matchResult = html.match(/(<script>[\s\S]*?<\/script>)/);
    const scriptContent = matchResult ? matchResult[1] : '';
    const cleanedHtml = grapesResult.html.replace(/<script[\s\S]*?<\/script>/g, '');
    console.log(scriptContent)

    console.log('html',grapesResult.html);

    let newSqlData = {
      ID: sqlId,
      DESCRIPTION: description,
      HTML: cleanedHtml,
      CSS: grapesResult.css,
      JAVASCRIPT: scriptContent,
    };
    const table = "BOARD_COMPONENT";
    // const { response, loading, error } = await apiCall(
    //   "/api/shem/BOARD_COMPONENT",
    //   "post",
    //   newSqlData,
    //   null
    // );

    await axios.put(`http://localhost:5000/api/shem/${table}/html`, {data: newSqlData})
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
        } else {
          console.log('에러');
        }
    })
  };

  const [searchData, setSearchData] = useState(null);

  const actionSuccess = (e) => {
    const searchData = response.data.find((item) => item.ID === e.value);
    console.log('searchData:', searchData);
    setSearchData(searchData);
  };

  if (searchData) {
    console.log('서치 데이터', searchData.ID);
  }

  function GrapesBuilder({ searchData }) {
    useEffect(() => {
      if (searchData) {
        const editor = grapesjs.init({
          container: '#gjs',
          fromElement: true,
          allowScripts: 1, //<script> 허용
        });
    
        const html = searchData.HTML;
        const css = searchData.CSS;
        let script = searchData.JAVASCRIPT;
        console.log('HTML:', html);
        console.log('CSS:', css);
        console.log('script:', script)
    
        // Remove <script> tags from the script
        script = script.replace(/<script[^>]*>|<\/script>/g, '');
    
        setTimeout(() => {
          editor.setComponents(html);
          editor.setStyle(css);
          editor.DomComponents.addComponent({ 
            tagName: 'script',
            attributes: { type: 'text/javascript' },
            content: script
          });
        }, 0);
      } else {
        console.log('No searchData available');
      }
    }, [searchData]);
    return <div id="gjs" />;
  }
  

  const { response, loading, HttpGetError } = useAPI(
    "/api/shem/BOARD_COMPONENT",
    "get"
  );

  const ids = response ? response.data.map((item) => item.ID) : [];

  return (
    <CardTemplate
      CardBody={
        <>
          <div className="col-lg-12 control-section">
          <div class="d-flex align-items-center mb-5">
              <p class="mb-0 col-md-1">템플릿 ID 검색</p>
              <div class="col-md-11">
                <InplaceEditorTemplate
                  dataSource={ids}
                  value=""
                  actionSuccess={actionSuccess}
                />
              </div>
            </div>
            <div class="d-flex align-items-center mb-5">
              <p class="mb-0 col-md-1">템플릿 ID</p>
              <div class="col-md-11">
                <input
                  placeholder="모델 ID 검색"
                  value={searchData ? searchData.ID : ''}
                  //onChange={(args) => setSqlId(args?.value)}
                />
              </div>
            </div>
            <div class="d-flex align-items-center mb-3">
              <p class="mb-0 col-md-1">템플릿 설명</p>
              <div class="col-md-11">
              <input
                placeholder="모델 설명"
                value={searchData ? searchData.DESCRIPTION : ''}
                //onChange={(e) => setDescription(e?.value)}
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
              <GrapesBuilder searchData={searchData}/>
            </div>
          </div>
        </>
      }
    ></CardTemplate>
  );
}

export default GrapesContent;
