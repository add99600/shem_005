/**
 * 위험성 평가표 상단 부분
 */

import { CombinedDataContext } from "../../risk_context/RiskProvider";
import { useContext } from "react";

export const MatrixBase = ({ selectedProcess }) => {
  const thStyle =
    "tw-bg-slate-300 tw-text-center tw-text-sm tw-font-semibold tw-border-t tw-border-t-white d-flex align-items-center justify-content-center tw-border-r tw-border-r-gray-300";
  const tdStyle =
    "tw-text-center tw-text-sm tw-border-t tw-border-t-gray-300 d-flex align-items-center justify-content-center tw-border-r tw-border-r-gray-300";

  const { handleMatrixData, matrixData } = useContext(CombinedDataContext);

  // input 변경 핸들러
  const handleInputChange = (e) => {
    const value = e.target.value;
    const ids = e.target.getAttribute('ids');
    
    if (selectedProcess?.name) {
      // 현재 선택된 공정의 기존 데이터 가져오기
      const currentProcessData = matrixData[selectedProcess.name] || {};
      
      // 새로운 값으로 업데이트
      const updatedProcessData = {
        ...currentProcessData,
        [ids]: value
      };
      
      // 선택된 공정명을 key로 사용하여 데이터 업데이트
      handleMatrixData(selectedProcess.name, updatedProcessData);
    }
  };
    
  return (
    <div className="d-flex flex-column">
      <div className="tw-grid tw-grid-cols-12 tw-border-b tw-border-b-gray-300">
        <div className={`${thStyle} tw-col-span-3 tw-row-span-2 py-1`}>
          평가대상
          <br />
          공정(작업)명
        </div>
        <div className={`${tdStyle} tw-col-span-3 tw-row-span-2 py-1`}>
          {selectedProcess?.name}
        </div>
        <div
          className={`${thStyle} tw-col-span-3 tw-row-span-2 py-1 tw-border-r-white`}
        >
          평가자(팀장 및 팀 구성원)
        </div>

        {/* 실행 책임자, 실행 담당자, 실시 주체 th */}
        <div className={`tw-col-span-3 tw-row-span-1 py-0`}>
          <div className="tw-grid tw-grid-cols-3 w-100 h-100">
            <div className={`${thStyle} tw-col-span-1 py-0 tw-border-r-white`}>
              실행 책임자
            </div>
            <div className={`${thStyle} tw-col-span-1 py-0 tw-border-r-white`}>
              실행 담당자
            </div>
            <div className={`${thStyle} tw-col-span-1 py-0 tw-border-r-0`}>
              실시 주체
            </div>
          </div>
        </div>

        {/* 실행 책임자, 실행 담당자, 실시 주체 input td */}
        <div className={`${tdStyle} tw-col-span-3 tw-row-span-1 tw-border-r-0`}>
          <div className="tw-grid tw-grid-cols-3 w-100 h-100">
            <div
              className={`tw-col-span-1 py-2 px-2 tw-border-r tw-border-r-gray-300`}
            >
              <input
                type="text"
                className="tw-input tw-input-bordered tw-input-xs w-100"
                data-theme="light"
                ids="EXECUTOR_MANAGER"
                onChange={handleInputChange}
                value={matrixData[selectedProcess?.name]?.EXECUTOR_MANAGER || ''}
              />
            </div>
            <div
              className={`tw-col-span-1 py-2 px-2 tw-border-r tw-border-r-gray-300`}
            >
              <input
                type="text"
                className="tw-input tw-input-bordered tw-input-xs w-100"
                data-theme="light"
                ids="EXECUTOR_CHARGE"
                onChange={handleInputChange}
                value={matrixData[selectedProcess?.name]?.EXECUTOR_CHARGE || ''}
              />
            </div>
            <div
              className={`tw-col-span-1 py-2 px-2 tw-border-r tw-border-r-gray-300`}
            >
              <input
                type="text"
                className="tw-input tw-input-bordered tw-input-xs w-100"
                data-theme="light"
                ids="EXECUTION_SUBJECT"
                onChange={handleInputChange}
                value={matrixData[selectedProcess?.name]?.EXECUTION_SUBJECT || ''}
              />
            </div>
          </div>
        </div>

        <div className={`${thStyle} tw-col-span-3 tw-row-span-2 py-1`}>
          평가일시
        </div>

        <div className={`${tdStyle} tw-col-span-3 tw-row-span-2 py-1 px-2`}>
          <input
            type="date"
            className="tw-input tw-input-bordered tw-input-xs w-100"
            data-theme="light"
            ids="EVALUATION_DATE"
            onChange={handleInputChange}
          />
        </div>

        <div
          className={`${thStyle} tw-col-span-3 tw-row-span-2 py-1 tw-border-r-white`}
        >
          평균 위험성
        </div>

        {/* 평균 위험성, 현재, 개선 후 th */}
        <div className={`tw-col-span-3 tw-row-span-1 py-0`}>
          <div className="tw-grid tw-grid-cols-2 w-100 h-100">
            <div className={`${thStyle} tw-col-span-1 py-0 tw-border-r-white`}>
              현재
            </div>
            <div className={`${thStyle} tw-col-span-1 py-0 tw-border-r-white`}>
              개선 후
            </div>
          </div>
        </div>

        {/* 평균 위험성, 현재, 개선 후 input td */}
        <div className={`${tdStyle} tw-col-span-3 tw-row-span-1 tw-border-r-0`}>
          <div className="tw-grid tw-grid-cols-2 w-100 h-100">
            <div
              className={`tw-col-span-1 py-2 px-2 tw-border-r tw-border-r-gray-300`}
            >
              <span>0.0</span>
            </div>
            <div
              className={`tw-col-span-1 py-2 px-2 tw-border-r tw-border-r-gray-300`}
            >
              <span>0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
