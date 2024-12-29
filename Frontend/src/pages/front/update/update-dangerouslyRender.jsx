import React, { useEffect, useState } from "react";
import {
  useAPI,
  DataManager,
  CheckboxGroup,
  AdminAccordion,
  TextBoxTemplate,
  TestButton,
  Calendar,
  DataProvider,
  SearchCode,
  DropDown,
  FileUpload,
  GridTemplate,
  QueryGrid,
  LinkButton,
  ButtonList,
  SHEM005Table,
  TextAreaTemplate,
  RegistTextAreaTemplate,
  HeavyTable,
  Shem007Table,
  TwSpan,
  InitialObject,
  DropDownToDropDown,
  TargetDropdown,
  CheckListShem014,
  TBMTextArea,
  TimeCalendar,
  WeatherInfo,
  Shem020Table,
  TextEditor,
  SideNav,
  ChemicalSearch,
  FileDownButton,
  Shem002FileManage,
  Shem002Button
} from "hanawebcore-frontend";
import parse, { domToReact } from "html-react-parser";

export default function DangerouslyRender({
  htmlString,
  menuId,
  componentData,
}) {
  const [settings, setSettings] = useState([]);

  const parseComponentData = () => {
    try {
      if (componentData?.data_0) {
        return JSON.parse(componentData.data_0);
      }
      return {};
    } catch (error) {
      console.error("Data parsing error:", error);
      return {};
    }
  };

  const parsedData = parseComponentData();

  console.log("parsedData:", parsedData);

  // body 태그를 제거하고 내부 내용만 추출
  const content = htmlString.replace(/<\/?body[^>]*>/g, "");

  // MENU_REGIST_MANAGE 테이블에서 settings 가져오기
  const { response, loading, HttpGetError } = useAPI(
    "http://localhost:5000/api/shem/REGIST_SQL_MANAGE",
    "get"
  );

  useEffect(() => {
    if (!loading && response) {
      // response 데이터에서 MENU_ID가 menuId인 데이터만 필터링 ex)shem005
      const filteredData = response.data.filter(
        (item) => item.MENU_ID === menuId
      );
      const settings = filteredData.map((item) => item.SETTINGS);

      setSettings(settings);
    }
  }, [loading, response]);

  if (!htmlString) {
    return null;
  }

  const getSettingsById = (id) =>
    settings.flat().find((setting) => setting.ids === id) || {};

  const getSettingsWithData = (attribs) => {
    const baseSetting = getSettingsById(attribs.ids) || {};

    // attribs.ids와 일치하는 데이터가 있는지 확인
    if (attribs.ids && parsedData[attribs.ids] !== undefined) {
      return {
        ...baseSetting,
        value: parsedData[attribs.ids],
        defaultValue: parsedData[attribs.ids],
        initialValue: parsedData[attribs.ids],
      };
    }

    return baseSetting;
  };

  const options = {
    replace: ({ name, attribs, children }) => {
      if (!attribs) return;

      // setting과 데이터를 합친 객체
      const combinedSettings = getSettingsWithData(attribs);

      const dateValue = parsedData[attribs.ids];
      const initialValue = parsedData[attribs.ids];

      switch (name) {
        case "datamanager":
          return (
            <DataManager {...attribs} {...combinedSettings}>
              {domToReact(children, options)}
            </DataManager>
          );
        case "checkboxgroup":
          return (
            <CheckboxGroup
              {...attribs}
              {...combinedSettings}
              initialValue={initialValue}
            >
              {domToReact(children, options)}
            </CheckboxGroup>
          );

        case "adminaccordion":
          return (
            <AdminAccordion {...attribs}>
              {domToReact(children, options)}
            </AdminAccordion>
          );

        case "fileupload":
          let files;
          
          // 모든 파일 키 확인
          if (parsedData["FILE1"] || parsedData["FILE2"] || parsedData["FILE3"] || parsedData["FILE4"] || parsedData["FILE5"]) {
            files = [
              parsedData["FILE1"],
              parsedData["FILE2"],
              parsedData["FILE3"],
              parsedData["FILE4"],
              parsedData["FILE5"],
            ].filter((file) => file != null);
          } else if (parsedData["FILE_NAME"]) {
            files = [parsedData["FILE_NAME"]].filter((file) => file != null);
          } else {
            files = [];
          }

          return (
            <FileUpload
              {...attribs}
              {...combinedSettings}
              initialValue={files}
              ids={attribs.ids}
            />
          );

        case "textboxtemplate":
          return <TextBoxTemplate {...attribs} {...combinedSettings} initialValue={dateValue}/>;
        case "registtextareatemplate":
          return <RegistTextAreaTemplate {...attribs} {...combinedSettings} />;
        case "tbutton":
          return <TestButton {...attribs} {...combinedSettings} />;
        case "calendar":
          return (
            <Calendar
              {...attribs}
              {...combinedSettings}
              initialValue={dateValue}
            />
          );
        case "searchcode":
          return (
            <SearchCode
              {...attribs}
              {...combinedSettings}
              initialValue={dateValue}
            />
          );

        case "dropdown":
          return (
            <DropDown
              {...attribs}
              {...combinedSettings}
              initialValue={dateValue}
            />
          );
        case "twspan":
          return <TwSpan {...attribs} {...combinedSettings} />;
        case "initialobject":
          return <InitialObject {...attribs} {...combinedSettings} />;
        case "gridtemplate":
          return <GridTemplate {...attribs} {...combinedSettings} />;
        case "querygrid":
          return <QueryGrid {...attribs} {...combinedSettings} />;
        case "linkbutton":
          return <LinkButton {...attribs} {...combinedSettings} />;
        case "buttonlist":
          return <ButtonList {...attribs} {...combinedSettings} />;
        case "shem005table":
          return <SHEM005Table {...attribs} {...combinedSettings} />;
        case "heavytable":
          return <HeavyTable {...attribs} {...combinedSettings} />;
        case "shem007table":
          return (
            <Shem007Table
              {...attribs}
              {...combinedSettings}
              initialValue={dateValue}
            />
          );
        case "shem020table":
          return (
            <Shem020Table
              {...attribs}
              {...combinedSettings}
              initialValue={dateValue}
            />
          );
        case "checklistshem014":
          return (
            <CheckListShem014
              {...attribs}
              {...combinedSettings}
              initialValue={dateValue}
            />
          );
        case "dropdowntodropdown":
          return (
            <DropDownToDropDown
              {...attribs}
              {...combinedSettings}
              initialValue={dateValue}
            />
          );
        case "targetdropdown":
          return (
            <TargetDropdown
              {...attribs}
              {...combinedSettings}
              initialValue={dateValue}
            />
          );
        case "chemicalsearch":
          return <ChemicalSearch {...attribs} {...combinedSettings} initialValue={dateValue}/>;
        case "tbmtextarea":
          return <TBMTextArea {...attribs} {...combinedSettings} />;
        case "timecalendar":
          return <TimeCalendar {...attribs} {...combinedSettings} />;
        case "weatherinfo":
          return <WeatherInfo {...attribs} {...combinedSettings} />;
        case "side__nav":
          return <SideNav {...attribs} {...combinedSettings} />;
        case "texteditor":
          return <TextEditor {...attribs} {...combinedSettings} />;
        case "filedownbutton":
          return <FileDownButton {...attribs} {...combinedSettings}/>;

          case "shem002filemanage":
            let shem002Files = Array(4).fill([]);  // 4개의 빈 배열로 초기화
          
            // FILE1~FILE4 데이터 처리
            ['FILE1', 'FILE2', 'FILE3', 'FILE4'].forEach((fileKey, index) => {
              if (parsedData[fileKey] && Array.isArray(parsedData[fileKey])) {
                shem002Files[index] = parsedData[fileKey].map(file => ({
                  name: file.filename,
                  size: file.size,
                  type: file.mimetype,
                  lastModified: file.lastModified,
                  path: file.path,
                  fullPath: file.fullPath,
                  savedAs: file.savedAs,
                  fieldName: file.fieldName,
                  isInitial: true
                }));
              }
            });
          
            console.log('전달할 초기 파일 데이터:', shem002Files);
            
            return (
              <Shem002FileManage 
                {...attribs} 
                {...combinedSettings}
                initialValue={shem002Files}
                ids={attribs.ids}
              />
            );
        case "shem002button":
          return <Shem002Button {...attribs} {...combinedSettings} />;


        default:
          return;
      }
    },
  };

  return (
    <DataProvider initialData={parsedData}>
      <div className="w-100">{parse(content, options)}</div>
    </DataProvider>
  );
}
