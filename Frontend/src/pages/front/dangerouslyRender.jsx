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
  CheckButton,
  FileList,
  TwButton,
  NoRegist
} from "hanawebcore-frontend";
import parse, { domToReact } from "html-react-parser";
import { useNavigate } from "react-router-dom";
import findFrontLink from "./findFrontLink";

export default function DangerouslyRender({ htmlString, menuId }) {
  const navigate = useNavigate();

  // body 태그를 제거하고 내부 내용만 추출

  const content = htmlString.replace(/<\/?body[^>]*>/g, "");

  const [settings, setSettings] = useState([]);

  // MENU_REGIST_MANAGE 테이블에서 settings 가져오기
  const { response, loading, HttpGetError } = useAPI(
    "http://localhost:5000/api/shem/MENU_REGIST_MANAGE",
    "get"
  );

  useEffect(() => {
    if (!loading && response) {
      console.log("MENU_REGIST_MANAGE", response);

      // response 데이터에서 MENU_ID가 menuId인 데이터만 필터링 ex)shem005
      const filteredData = response.data.filter(
        (item) => item.MENU_ID === menuId
      );
      const settings = filteredData.map((item) => item.SETTINGS);

      console.log("settings", settings);
      setSettings(settings);
    }
  }, [loading, response]);

  if (!htmlString) {
    return null;
  }

  const rowClickHandler = (e, menuId) => {
    const link = findFrontLink(menuId);
    navigate(`${link}/${e.ID}`);
  };

  const getSettingsById = (id) =>
    settings?.flat().find((setting) => setting?.ids === id) || {};

  const options = {
    replace: ({ name, attribs, children }) => {
      if (!attribs) return;

      const setting = getSettingsById(attribs.ids);

      switch (name) {
        case "datamanager":
          return (
            <DataManager {...attribs}>
              {domToReact(children, options)}
            </DataManager>
          );
        case "checkboxgroup":
          return (
            <CheckboxGroup {...attribs}>
              {domToReact(children, options)}
            </CheckboxGroup>
          );
        case "adminaccordion":
          return (
            <AdminAccordion {...attribs}>
              {domToReact(children, options)}
            </AdminAccordion>
          );
        case "textboxtemplate":
          return <TextBoxTemplate {...attribs} />;
        case "tbutton":
          return <TestButton {...attribs} {...setting} />;
        case "calendar":
          return <Calendar {...attribs} />;
        case "searchcode":
          return <SearchCode {...attribs} />;
        case "dropdown":
          return <DropDown {...attribs} />;
        case "fileupload":
          return <FileUpload {...attribs} />;
        case "gridtemplate":
          return <GridTemplate {...attribs} />;
        case "querygrid":
          return (
            <QueryGrid
              {...attribs}
              {...setting}
              rowClickHandler={(e) => rowClickHandler(e, setting.menuid)}
            />
          );
        case "linkbutton":
          return <LinkButton {...attribs} {...setting} />;
        case "checkbutton":
          return <CheckButton {...attribs} {...setting} />;
        case "filelist":
          return <FileList {...attribs} {...setting} />;
        case "tailwind__button":
          return <TwButton {...attribs} {...setting} />;
        case "noregist":
          return <NoRegist {...attribs} {...setting} />;
        default:
          return;
      }
    },
  };

  return (
    <DataProvider>
      <div className="w-100 h-100">{parse(content, options)}</div>
    </DataProvider>
  );
}
