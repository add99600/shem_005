/**
 * 위험성 평가 사전준비 - 사업장정보 카드
 *
 * Action : 평가 기본정보 Card의 평가 부서가 변경될 때 사업자 정보를 맞춰줍니다
 *
 */

import { RiskCard } from "../../../risk_component";
import { useContext } from "react";
import { CombinedDataContext } from "../../../risk_context/RiskProvider";
import SaveButton from "../../../risk_component/SaveButton";

export const WorkplaceInfoCard = () => {
  const { combinedData } = useContext(CombinedDataContext);

    // 부서에 따른 사업장 정보 설정
    const getWorkplaceInfo = () => {
      if (combinedData?.DEPT_NM === '645') {
        return {
          name: "하나옵트로닉스",
          representative: "함헌주"
        };
      } else if (combinedData?.DEPT_NM === '634') {
        return {
          name: "하나WLS",
          representative: "김길백" 
        };
      }
      return {
        name: "하나마이크론",
        representative: "이동철"
      };
    };
  
    const workplaceInfo = getWorkplaceInfo();

  return (
    <RiskCard className="h-100">
      <div className="d-flex flex-column">
        <div className="mb-5">
          <span className="tw-text-lg tw-font-semibold">사업장 정보</span>
        </div>
        <div className="tw-grid tw-grid-cols-12">
          <div className="tw-col-span-6">
            <span className="tw-text-sm tw-font-semibold">사업장 명</span>
          </div>
          <div className="tw-col-span-6">
            <span className="tw-text-sm tw-font-semibold">대표자</span>
          </div>
          <div className="mt-1 tw-col-span-6">
            <span className="tw-text-sm">{workplaceInfo.name}</span>
          </div>
          <div className="mt-1 tw-col-span-6">
            <span className="tw-text-sm">{workplaceInfo.representative}</span>
          </div>
        </div>
      </div>
      <SaveButton />
    </RiskCard>
  );
};
