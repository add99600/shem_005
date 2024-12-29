/**
 * 위험성 평가 사전준비 단계
 *
 ********** 컴포넌트 구조 **********
 * /평가 기본정보 카드
 *      /기존 위험성평가 불러오기 팝업
 *      /기타 유해정보입력 팝업
 * /사업장 정보 카드
 * /평가대상공정추가 카드
 * /공정리스트 카드
 *      /설비추가 팝업
 *      /물질추가 팝업
 *
 ********** 컴포넌트 구조 **********
 */

import { WorkplaceInfoCard } from "./workplace-info/WorkplaceInfoCard";
import { BasicInfoCard } from "./basic-info/BasicInfoCard";
import { ProcessAddCard } from "./process-add/ProcessAdd";
import { ProcessListCard } from "./process-list/ProcessList";

export const PreperationStep = () => {
  return (
    <div className="tw-grid tw-grid-cols-12 tw-gap-2">
      <div className="tw-col-span-9">
        <BasicInfoCard />
      </div>
      <div className="tw-col-span-3">
        <WorkplaceInfoCard />
      </div>

      <div className="mt-3 tw-col-span-12">
        <ProcessAddCard />
      </div>

      <div className="mt-3 tw-col-span-12">
        <ProcessListCard />
      </div>
    </div>
  );
};
