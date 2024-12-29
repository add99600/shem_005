import { RichTextEditorComponent, HtmlEditor, Toolbar, FormatPainter, QuickToolbar, Image, Link, Table, Audio, Video, Inject, PasteCleanup } from "@syncfusion/ej2-react-richtexteditor";
import React, { useEffect, useState, useRef } from 'react';
import CardTemplate from "../template/card-template";
import axios from 'axios';
import { ListViewComponent } from '@syncfusion/ej2-react-lists';


function MailTest2() {
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

    // 드롭다운 데이터
    const [dropdownData, setDropdownData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/mail/template/list');
                const data = response.data.data;
    
                // dropdownData를 적절한 형태로 변환합니다.
                const transformedData = data.map((item, index) => ({
                    value: index,
                    label: item[0]
                }));
    
                setDropdownData(transformedData);
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            }
        };
    
        fetchData();
    }, []);



    const [editorContent, setEditorContent] = useState('메일 템플릿을 선택해 주세요');

    const handleDropdownChange = async (event) => {
        const selectedIndex = event.target.value;

        // 선택한 항목의 데이터를 가져옵니다.
        const selectedItemData = dropdownData[selectedIndex];

        try {
            const response = await axios.post('http://localhost:5000/api/mail/template/data', {
                selectedValue: selectedItemData
            });
            setEditorContent(response.data.data);
        } catch (error) {
            console.error('데이터를 전송하지 못했습니다', error);
        }
    };

    const handleListViewClick = (text) => {
      const range = formatPainterRTE.getRange();
      formatPainterRTE.executeCommand('insertHTML', text, range);
  };

    // ListView 
    const [ListViewData, setListViewData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axios.get('http://localhost:5000/api/mail/list-view');
              const formattedData = response.data.data.map(item => ({ text: item[0] }));
              setListViewData(formattedData);
              console.log(response.data.data);
          } catch (error) {
              console.error('데이터를 가져오는데 실패했습니다', error);
          }
      };
  
      fetchData();
  }, []);


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
                  <ListViewComponent 
                      id="sample-list" 
                      dataSource={ListViewData} 
                      select={(args) => handleListViewClick(args.text)} 
                  />
                  </>
              }
            ></CardTemplate>
          </div>
          <div className="col-lg-10 mail__container">
          <CardTemplate
            CssClass="ms-3"
            CardBody={
              <>
                <div className="dropdown">
                    <select id="dropdown" onChange={handleDropdownChange}>
                        {dropdownData.map((item, index) => (
                            <option key={index} value={item.value}>{item.label}</option>
                        ))}
                    </select>
                </div>
                <div className="mail__titlebar d-flex align-items-center">
                  <span className="ms-3">Mail Editor</span>
                </div>
                <RichTextEditorComponent 
                    id="formatPainterRTE" 
                    ref={(richtexteditor) => { formatPainterRTE = richtexteditor; }} 
                    toolbarSettings={toolbarSettings}
                    value={editorContent}
                    onClick={(e) => {
                      const clickedData = e.target.textContent; // 클릭한 데이터를 가져옵니다.
                      handleListViewClick(clickedData); // 클릭한 데이터를 RichTextEditorComponent에 삽입합니다.
                    }}
                >
                    <Inject services={[HtmlEditor, Toolbar, FormatPainter, QuickToolbar, Image, Link, Table, PasteCleanup, Audio, Video]}/>
                </RichTextEditorComponent>
              </>
            }
          />
        </div>
      </div>
    );
}

export default MailTest2;