/**
 * 위험성평가 표 작성 단계의 왼쪽 네비게이션 컴포넌트
 *
 * RiskTab은 RiskBoard.jsx에서만 쓰지만
 *
 * 왼쪽에 네비게이션의 상단 빈공간을 만들기 위해서 tw-invisible을 추가해서 공간만 차지하게 해서
 *
 * 위아래를 맞췄습니다
 *
 *
 */

import { RiskTab, RiskCard, GridHeader } from "../../risk_component";
import { useState, useContext, useEffect } from "react";
import { CombinedDataContext, } from "../../risk_context/RiskProvider";

export const MatrixNav = ({ onProcessSelect }) => {
  const TAB_DATA = [{ id: "preparation", label: "사전준비" }]; // RiskTab의 더미데이터 수정불필요

  const { combinedData, handleMatrixData } = useContext(CombinedDataContext);
  const [processList, setProcessList] = useState([]);

  useEffect(() => {
    if (combinedData?.SELECTED_PROCESS) {
      // SELECTED_PROCESS 배열을 processList 형식으로 변환
      const formattedProcessList = combinedData.SELECTED_PROCESS.map((processName, index) => ({
        id: index + 1,
        name: processName
      }));
      
      setProcessList(formattedProcessList);

      // 각 프로세스에 대한 초기 데이터 설정
      combinedData.SELECTED_PROCESS.forEach(processName => {
        // 공정별 데이터가 있으면 그대로 사용, 없으면 빈 객체 사용
        const processData = combinedData[processName] || {};
        
        // handleMatrixData로 전달
        handleMatrixData(processName, processData);
      });
    }
  }, [combinedData]);

  const handleProcessChange = (e) => {
    const processId = parseInt(e.target.value, 10);
    const selectedProcess = processList.find((p) => p.id === processId);
    
    if (selectedProcess) {
      onProcessSelect(selectedProcess); // 선택된 공정을 상위 컴포넌트로 전달
    }
  };

  return (
    <div>
      <RiskTab className="tw-invisible" tabData={TAB_DATA} />
      {/* RiskTab의 invisible용도 수정불필요 */}
      <div className="tw-flex tw-flex-col">
        <RiskCard className="me-2" bodyClassName="p-3">
          <div className="tw-grid tw-grid-cols-12">
            <GridHeader title="공정선택" span={12} />
            <div className="mt-2 tw-col-span-12">
              <select
                className="w-100 tw-select tw-select-bordered tw-select-xs"
                data-theme="light"
                onChange={handleProcessChange}
              >
                <option value="">공정선택</option>
                {processList.map((process) => (
                  <option value={process.id}>{process.name}</option>
                ))}
              </select>
            </div>
          </div>
        </RiskCard>
      </div>
    </div>
  );
};
