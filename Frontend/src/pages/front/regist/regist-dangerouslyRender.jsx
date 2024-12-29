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
  TwConfirmModal,
  InitialObject,
  DropDownToDropDown,
  TargetDropdown,
  CheckListShem014,
  TimeCalendar,
  TBMTextArea,
  WeatherInfo,
  FileList,
  Shem011Upload,
  Shem020Table,
  SideNav,
  TwRadio,
  TextEditor,
  TwChips,
  TwGrid,
  ChemicalSearch,
  FileDownButton,
  Shem002FileManage,
  Shem002Button,
  TwButton,
} from "hanawebcore-frontend";
import parse, { domToReact } from "html-react-parser";
import useParams from "../useParams";
import useModalParams from "../useModalParams";
import { useRadioParams } from "../useRadioParams";
import { useNavigate } from "react-router-dom";
import findFrontLink from "../findFrontLink";
import useOnClickParams from "../useOnClickParams";

export default function DangerouslyRender({ htmlString, menuId }) {
  // params 가져오기
  const params = useParams({});
  const modalParams = useModalParams();
  const radioParams = useRadioParams();
  const navigate = useNavigate();
  const { handleClick } = useOnClickParams();

  const content = htmlString.replace(/<body[^>]*>([\s\S]*)<\/body>/, "$1"); // body 태그 사이의 내용만 추출

  const [settings, setSettings] = useState([]);

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

  const rowClickHandler = (e, ids) => {
    const link = findFrontLink(ids);
    navigate(`/${link}/${e.id}`);
  };

  const options = {
    replace: ({ name, attribs, children }) => {
      if (!attribs) return;

      const setting = getSettingsById(attribs.ids);

      switch (name) {
        case "datamanager":
          return (
            <DataManager {...attribs} {...setting}>
              {domToReact(children, options)}
            </DataManager>
          );
        case "checkboxgroup":
          return (
            <CheckboxGroup {...attribs} {...setting}>
              {domToReact(children, options)}
            </CheckboxGroup>
          );
        // 아코디언 임시 변경
        case "adminaccordion":
          return (
            <AdminAccordion {...attribs} {...setting}>
              {domToReact(children, options)}
            </AdminAccordion>
          );
        case "textboxtemplate":
          return <TextBoxTemplate {...attribs} {...setting} />;
        case "registtextareatemplate":
          return <RegistTextAreaTemplate {...attribs} {...setting} />;
        case "tbutton":
          return <TestButton {...attribs} {...setting} />;
        case "calendar":
          return <Calendar {...attribs} {...setting} />;
        case "searchcode":
          return <SearchCode {...attribs} {...setting} />;
        case "dropdown":
          return <DropDown {...attribs} {...setting} />;
        case "fileupload":
          return <FileUpload {...attribs} {...setting} />;
        case "gridtemplate":
          return <GridTemplate {...attribs} {...setting} />;
        case "querygrid":
          return <QueryGrid {...attribs} {...setting} />;
        case "linkbutton":
          return <LinkButton {...attribs} {...setting} />;
        case "buttonlist":
          return <ButtonList {...attribs} {...setting} />;
        case "shem005table":
          return <SHEM005Table {...attribs} {...setting} />;
        case "heavytable":
          return <HeavyTable {...attribs} {...setting} />;
        case "dropdowntodropdown":
          return <DropDownToDropDown {...attribs} {...setting} />;
        case "targetdropdown":
          return <TargetDropdown {...attribs} {...setting} />;
        case "tailwind__span":
          return <TwSpan {...attribs} {...setting} params={params} />;
        case "tailwind__button":
          let _onClick = () => {};

          if (setting.buttonType && setting.targetId) {
            _onClick = handleClick(setting.buttonType, {
              targetId: setting.targetId,
            });
          }

          return <TwButton {...attribs} {...setting} onClick={_onClick} />;
        case "initial__object":
          return (
            <InitialObject
              {...attribs}
              {...setting}
              params={params}
            ></InitialObject>
          );
        case "tailwind__confirmmodal":
          return (
            <TwConfirmModal {...attribs} {...setting} params={modalParams} />
          );
        case "tailwind__chips":
          return <TwChips {...attribs} {...setting} />;
        case "side__nav":
          return <SideNav {...attribs} {...setting} />;
        case "shem007table":
          return <Shem007Table {...attribs} {...setting} />;
        case "checklistshem014":
          return <CheckListShem014 {...attribs} {...setting} />;
        case "tailwind__radio":
          return (
            <TwRadio {...attribs} {...setting} radioParams={radioParams} />
          );
        case "tailwind__grid":
          return (
            <TwGrid
              {...attribs}
              {...setting}
              rowClickHandler={(e) => rowClickHandler(e, attribs.ids)}
            />
          );

        case "tbmtextarea":
          return <TBMTextArea {...attribs} {...setting} />;
        case "timecalendar":
          return <TimeCalendar {...attribs} {...setting} />;
        case "weatherinfo":
          return <WeatherInfo {...attribs} {...setting} />;
        case "filelist":
          return <FileList {...attribs} {...setting} />;
        case "shem011upload":
          return <Shem011Upload {...attribs} {...setting} />;
        case "shem020table":
          return <Shem020Table {...attribs} {...setting} />;
        case "texteditor":
          return <TextEditor {...attribs} {...setting} />;
        case "chemicalsearch":
          return <ChemicalSearch {...attribs} {...setting}/>;
        case "filedownbutton":
          return <FileDownButton {...attribs} {...setting}/>;
        case "shem002filemanage":
          return <Shem002FileManage {...attribs} {...setting}/>;
        case "shem002button":
          return <Shem002Button {...attribs} {...setting}/>;
        default:
          return undefined;
      }
    },
    trim: true,
  };

  return (
    <DataProvider>
      <div className="w-100 h-100">{parse(content, options)}</div>
    </DataProvider>
  );
}
