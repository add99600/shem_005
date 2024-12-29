/**
 * 위험성 평가 최상위 페이지
 *
 * 탭 순서는 tabData의 순서대로 렌더링됩니다
 *
 * 각 컴포넌트의 export는 전부 export const로 default 없음에 유의 { } 중괄호 반드시 사용
 */

import { RiskTab } from "./risk_component";
import RiskProvider from "./risk_context/RiskProvider";
import { useState } from "react";
import PageHeader from "../page-header";
import { PreperationStep } from "./risk_domain/preparation/PreperationStep";
import { MatrixStep } from "./risk_domain/matrix/MatrixStep";
import { MatrixNav } from "./risk_domain/matrix/MatrixNav";
import { AllTable } from "./risk_domain/standaradTable/AllTable";
import { RiskNavigation } from "./risk_domain/navigation/RiskNavigation";

const RiskBoard = () => {
  /**
   * 변수 선언부
   */
  const [activeTab, setActiveTab] = useState(0); // 현재 탭 인덱스
  const [selectedProcess, setSelectedProcess] = useState(null);
  /**
   * 탭 데이터 상수
   * content : 탭 컨텐츠(import 된 컴포넌트)
   * navigation : 왼쪽부분 네비게이션(위험성평가 작성 탭에서 사용)
   */
  const TAB_DATA = [
    { id: "preparation", label: "사전준비", content: <PreperationStep /> },
    { id: "standard", label: "위험성평가 기준표", content: <AllTable /> },
    {
      id: "evaluation",
      label: "위험성평가 작성",
      content: <MatrixStep selectedProcess={selectedProcess} />, // 위험성평가 작성에서 선택된 공정 MatrixNav -> MatrixStep
      navigation: <MatrixNav onProcessSelect={setSelectedProcess} />, // 위험성평가 작성에서 선택된 공정 MatrixNav -> MatrixStep
    },
    { id: "improvement", label: "개선조치 계획 및 확인" },
    { id: "result", label: "위험성평가 결과" },
  ];

  return (
    <RiskProvider>
      <div style={{ backgroundColor: "var(--bs-body-bg)" }}>
        <PageHeader title="위험성평가 등록" />
        <div class="container-fluid bg-white p-4 d-flex">
          <div className="col-md-1">{TAB_DATA[activeTab].navigation}</div>
          <div className="d-flex col-md-10">
            <RiskTab
              tabData={TAB_DATA}
              activeIndex={activeTab}
              onTabChange={setActiveTab}
              className="w-100"
            >
              {TAB_DATA[activeTab].content}
            </RiskTab>
          </div>
          <div className="col-md-1">
            <RiskNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>
    </RiskProvider>
  );
};

export default RiskBoard;
