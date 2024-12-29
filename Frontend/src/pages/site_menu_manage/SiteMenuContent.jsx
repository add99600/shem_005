import CardTemplate from "../template/card-template";
import { apiCall, GridTemplate, DataContext } from "hanawebcore-frontend";
import React, { useState, useContext, useEffect } from "react";
import NewMenuTab from "./NewMenuTab";
import AuthGroupTab from "./AuthGroupTab";
import axios from "axios";

function SiteMenuContent() {
  /**
   * 변수 선언부
   */
  const [tabIndex, setTabIndex] = useState(0); // 현재 탭 인덱스
  const [tabData, setTabData] = useState([]); // 탭 데이터
  const [tabContent, setTabContent] = useState(null); // 탭 컨텐츠

  /**
   * 탭 클릭 이벤트 핸들러
   * 클릭한 탭 인덱스 set
   */
  const handleTabClick = (index) => {
    setTabIndex(index);
  };

  /**
   * 탭 데이터 초기화
   */
  const initTabData = () => {
    setTabData([
      { label: "신규메뉴생성", value: 0 },
      { label: "권한그룹관리", value: 1 },
    ]);
  };

  useEffect(() => {
    initTabData();
  }, []);

  useEffect(() => {
    if (tabIndex === 0) {
      setTabContent(<NewMenuTab />);
    } else if (tabIndex === 1) {
      setTabContent(<AuthGroupTab />);
    }
  }, [tabIndex]);

  return (
    <CardTemplate
      CardBody={
        <>
          <div className="control-section">
            <div role="tablist" class="tw-tabs tw-tabs-bordered d-flex">
              {tabData.map((tab, index) => (
                <div
                  role="tab"
                  class={`tw-tab mx-2  ${
                    tabIndex === index
                      ? "tw-tab-active tw-text-black tw-font-semibold"
                      : ""
                  }`}
                  onClick={() => handleTabClick(index)}
                >
                  {tab.label}
                </div>
              ))}
            </div>
            {tabContent}
          </div>
        </>
      }
    ></CardTemplate>
  );
}

export default SiteMenuContent;
