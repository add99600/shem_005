import { RichTextEditorComponent, HtmlEditor, Toolbar, FormatPainter, QuickToolbar, Link, Image, Table, Audio, Video, Inject, PasteCleanup } from "@syncfusion/ej2-react-richtexteditor";
import React, { useEffect } from 'react';
import CardTemplate from "../template/card-template";
import axios from 'axios';

function FormatPainterRTE() {
    let formatPainterRTE;
    const toolbarSettings = {
        items: ['FormatPainter', 'Bold', 'Italic', 'Underline', 'StrikeThrough',
            'SuperScript', 'SubScript', '|', 'FontName', 'FontSize', 'FontColor', 'BackgroundColor', 'LowerCase', 'UpperCase', '|',
            'Formats', 'Alignments', 'Blockquote', 'OrderedList', 'UnorderedList', '|',
            'Outdent', 'Indent', '|', 'CreateLink', 'Image', 'Video', 'Audio', 'CreateTable', '|', 'SourceCode', 'Undo', 'Redo']
    };

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.syncfusion.com/ej2/26.2.4/fluent2.css';
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);

        };
    }, []);


    const handleSave = async () => {
      const sourceCode = formatPainterRTE.value;
      const topMenuValue = document.getElementById('top_menu').value;
      const nameValue = document.getElementById('name').value;

      try {
          const response = await axios.post('http://localhost:5000/api/make/mail/template', {
              sourceCode: sourceCode,
              topMenu: topMenuValue,
              name: nameValue
          });
      } catch (error) {
          console.error('Error sending source code to server:', error);
      }
    };

    return (
      <div className="d-flex">
        <div className="col-lg-2">
            <CardTemplate
              CardBody={
                <>
                  <h5>
                    <label
                      style={{
                        display: "block",
                        margin: "1px",
                        paddingTop: "5px",
                      }}
                    >
                      Select Field to Insert
                    </label>
                  </h5>
                  <div id="listview"></div>
                </>
              }
            ></CardTemplate>
          </div>
          <div className="col-lg-10 mail__container">
          <CardTemplate
            CssClass="ms-3"
            CardBody={
              <>
                <div className="mail__titlebar d-flex align-items-center">
                  <span className="ms-3">Mail Editor</span>
                  <span></span>
                  <span className="ms-3">top_menu:</span>
                  <input id="top_menu"></input>
                  <span className="ms-3">제목:</span>
                  <input id="name"></input>
                  <span></span>
                  <button onClick={handleSave}>저장</button>
                </div>

                <RichTextEditorComponent 
                  id="formatPainterRTE" 
                  ref={(richtexteditor) => { formatPainterRTE = richtexteditor; }} 
                  toolbarSettings={toolbarSettings}>
                    <h3>메일 시스템</h3>
                      <Inject services={[HtmlEditor, Toolbar, FormatPainter, QuickToolbar, Image, Link, Table, PasteCleanup, Audio, Video]}/>
                </RichTextEditorComponent>
              </>
            }
          />
        </div>
      </div>
    );
}

export default FormatPainterRTE;