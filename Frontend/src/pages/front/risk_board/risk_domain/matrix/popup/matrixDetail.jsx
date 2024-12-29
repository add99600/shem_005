/**
 * 위험성 평가표 1행 상세 조회 팝업
 * 
 * matrixDetailData.jsx 에서 드롭다운 데이터 불러옴
 */

import { GridHeader, RiskCard } from "../../../risk_component";
import { TwConfirmModal } from "hanawebcore-frontend";
import { CombinedDataContext } from "../../../risk_context/RiskProvider";
import { useContext, useEffect, useState } from "react";

export const MatrixDetailPopup = ({ process, rowData, detailData, rowIndex, selectedRowIndex }) => {
  const { handleMatrixData, matrixData } = useContext(CombinedDataContext);

    // 선택된 행이 현재 행과 일치하는지 확인
    const isCurrentRow = rowIndex === selectedRowIndex;

  // 현재 행의 데이터 가져오기
  const getCurrentRowData = () => {
    if (!process?.name || rowIndex === undefined) return {};
    return matrixData[process?.name]?.[rowIndex] || {};
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const ids = e.target.getAttribute('ids');
    
    if (process?.name && isCurrentRow) {  // 선택된 행인 경우만 데이터 업데이트
      const currentProcessData = [...(matrixData[process.name] || [])];
      
      currentProcessData[rowIndex] = {
        ...currentProcessData[rowIndex],
        [ids]: value
      };

      handleMatrixData(process.name, currentProcessData);
    }
  };
  
  return (
    <TwConfirmModal
      openButtonText="Detail"
      openButtonClassName="tw-btn-neutral tw-btn-xs"
      title={`${process?.name} 위험성평가표 상세조회`}
      content={<Content 
        rowData={rowData} 
        onInputChange={handleInputChange} 
        process={process}
        matrixData={matrixData}
        accidentTypes={detailData.accidentTypes}
        isCurrentRow={isCurrentRow}  // 현재 행 여부 전달
      />}
      className="justify-content-center tw-bg-transparent"
      modalContentClassName="tw-min-w-[80%] tw-max-w-[80%]"
      closeIconClassName="tw-btn-neutral tw-btn-sm m-2"
      acceptIconClassName="tw-btn-neutral"
      theme="light"
    />
  );
};

const Content = ({ rowData, onInputChange, process, matrixData, accidentTypes }) => {
  const { handleMatrixData } = useContext(CombinedDataContext);
  const [selectedAccidentType, setSelectedAccidentType] = useState(matrixData[process?.name]?.ACCIDENT_TYPE || '');
  const [selectedCauseType, setSelectedCauseType] = useState(matrixData[process?.name]?.CAUSE_TYPE || '');
  const [causeTypes, setCauseTypes] = useState([]);

  // 재해유형 선택 시 해당하는 기인요인 목록 업데이트
  const handleAccidentTypeChange = (e) => {
    const value = e.target.value;
    const ids = e.target.getAttribute('ids');
    
    console.log('Selected Accident Type:', value);
    setSelectedAccidentType(value);

    // 선택된 재해유형의 기인요인 목록 찾기
    const selectedAccident = accidentTypes.find(type => type.name === value);
    setCauseTypes(selectedAccident ? selectedAccident.causeTypes : []);

    if (process?.name) {
      const currentProcessData = matrixData[process.name] || {};
      handleMatrixData(process.name, {
        ...currentProcessData,
        [ids]: value,
        CAUSE_TYPE: ''  // 재해유형이 변경되면 기인요인 초기화
      });
      setSelectedCauseType('');  // 기인요인 선택값도 초기화
    }
  };

  // 기인요인 선택 핸들러
  const handleCauseTypeChange = (e) => {
    const value = e.target.value;
    const ids = e.target.getAttribute('ids');
    
    setSelectedCauseType(value);
    
    if (process?.name) {
      const currentProcessData = matrixData[process.name] || {};
      handleMatrixData(process.name, {
        ...currentProcessData,
        [ids]: value
      });
    }
  };

  // 가능성(A) 값 변경 핸들러
  const handleProbabilityChange = (e) => {
    const value = e.target.value;
    
    if (process?.name) {
      const probability = Number(value);
      const severity = Number(matrixData[process?.name]?.CURRENT_SEVERITY || 0);
      const risk = probability * severity;
      
      const currentProcessData = matrixData[process.name] || {};
      const updatedProcessData = {
        ...currentProcessData,
        CURRENT_PROBABILITY: value,
        PROBABILITY_LABEL: `${value} - ${getProbabilityLabel(value)}`,
        CURRENT_RISK: risk
      };

      // 위험성 코드 처리
      if (risk >= 10 && !currentProcessData.RISK_CODE) {
        updatedProcessData.RISK_CODE = generateRiskCode();
      } else if (risk < 10 && currentProcessData.RISK_CODE) {
        updatedProcessData.RISK_CODE = '';
      }

      handleMatrixData(process.name, updatedProcessData);
    }
  };

  // 중대성(B) 값 변경 핸들러
  const handleSeverityChange = (e) => {
    const value = e.target.value;
    
    if (process?.name) {
      const probability = Number(matrixData[process?.name]?.CURRENT_PROBABILITY || 0);
      const severity = Number(value);
      const risk = probability * severity;

      const currentProcessData = matrixData[process.name] || {};
      const updatedProcessData = {
        ...currentProcessData,
        CURRENT_SEVERITY: value,
        IMPROVED_SEVERITY: value,
        SEVERITY_LABEL: `${value} - ${getSeverityLabel(value)}`,
        CURRENT_RISK: risk
      };

      // 위험성 코드 처리
      if (risk >= 10 && !currentProcessData.RISK_CODE) {
        updatedProcessData.RISK_CODE = generateRiskCode();
      } else if (risk < 10 && currentProcessData.RISK_CODE) {
        updatedProcessData.RISK_CODE = '';
      }

      handleMatrixData(process.name, updatedProcessData);
    }
  };

    // 개선 후 가능성(A) 값 변경 핸들러
    const handleImprovedProbabilityChange = (e) => {
      const value = e.target.value;
      
      if (process?.name) {
        const probability = Number(value);
        const severity = Number(matrixData[process?.name]?.IMPROVED_SEVERITY || 0);
        const risk = probability * severity;
  
        const currentProcessData = matrixData[process.name] || {};
        const updatedProcessData = {
          ...currentProcessData,
          IMPROVED_PROBABILITY: value,
          IMPROVED_PROBABILITY_LABEL: `${value} - ${getProbabilityLabel(value)}`,
          IMPROVED_RISK: risk
        };
  
        handleMatrixData(process.name, updatedProcessData);
      }
    };

    // 가능성 라벨 반환 함수
    const getProbabilityLabel = (value) => {
      const labels = {
        '1': '년 1회',
        '2': '반기 1회',
        '3': '분기 1회',
        '4': '월 1회',
        '5': '주 1회',
        '6': '1일 1회'
      };
      return labels[value] || '';
    };

    // 중대성 라벨 반환 함수
    const getSeverityLabel = (value) => {
      const labels = {
        '1': '영향없음',
        '2': '휴업3일미만',
        '3': '휴업3일이상',
        '4': '휴업1개월이상',
        '5': '휴업3개월이상'
      };
      return labels[value] || '';
    };
    
    // 개선 후 위험성 계산 함수
    const calculateImprovedRisk = () => {
      const probability = Number(matrixData[process?.name]?.IMPROVED_PROBABILITY || 0);
      const severity = Number(matrixData[process?.name]?.IMPROVED_SEVERITY || 0);
      return probability * severity;
    };

    // 위험성 계산 함수
    const calculateRisk = () => {
      const probability = Number(matrixData[process?.name]?.CURRENT_PROBABILITY || 0);
      const severity = Number(matrixData[process?.name]?.CURRENT_SEVERITY || 0);
      const risk = probability * severity;
  
      if (process?.name) {
        const currentProcessData = matrixData[process.name] || {};
        
        if (risk >= 10 && !currentProcessData.RISK_CODE) {
          // 위험성이 10 이상이고 코드가 없을 때 새 코드 생성
          const updatedProcessData = {
            ...currentProcessData,
            RISK_CODE: generateRiskCode()
          };
          handleMatrixData(process.name, updatedProcessData);
        } else if (risk < 10 && currentProcessData.RISK_CODE) {
          // 위험성이 10 미만이고 코드가 있을 때 코드 제거
          const updatedProcessData = {
            ...currentProcessData,
            RISK_CODE: ''
          };
          handleMatrixData(process.name, updatedProcessData);
        }
      }
  
      return risk;
    };

    // 위험성 코드 생성 함수
    const generateRiskCode = () => {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `R${year}${month}-${random}`;  // 예: R2312-001
    };

    // 현재 위험성이 10 이상인지 확인하는 함수
    const isRiskHighEnough = () => {
      return calculateRisk() >= 10;
    };

      // 위험성 표시를 위한 getter 함수
  const getCurrentRisk = () => {
    return matrixData[process?.name]?.CURRENT_RISK || 0;
  };
  const getImprovedRisk = () => {
    return matrixData[process?.name]?.IMPROVED_RISK || 0;
  };

  const getCurrentValue = (field) => matrixData[field] || '';

  return (
    <>
      <div className="tw-flex tw-w-full tw-h-auto" data-theme="light">
        {/* 팝업의 왼쪽 */}
        <div className="tw-flex tw-flex-col tw-w-full">
          <div className="tw-grid tw-grid-cols-12 tw-gap-2">
            <GridHeader
              title="평가구분"
              span={6}
              className="d-flex justify-content-start"
            />

            <GridHeader
              title="코드번호"
              span={6}
              className="d-flex justify-content-start"
            />

            <div className="tw-col-span-6 d-flex justify-content-start mt-1 mb-2">
              <select
                data-theme="light"
                className="px-2 tw-select tw-select-xs tw-select-bordered tw-min-w-52"
                ids="EVALUATION_TYPE"
                onChange={onInputChange}
                value={getCurrentValue('EVALUATION_TYPE')}
              >
                <option value="" disabled>
                  평가구분
                </option>
                <option value="기계적">기계적</option>
                <option value="물질환경적">물질환경적</option>
                <option value="인적">인적</option>
                <option value="관리적">관리적</option>
              </select>
            </div>

            <div className="tw-col-span-6 d-flex justify-content-start mt-1 mb-2">
              <input
                type="text"
                className="tw-input tw-input-bordered tw-input-xs w-100"
                placeholder="위험성 10 이상 시 코드 부여"
                ids="RISK_CODE"
                value={getCurrentValue('RISK_CODE')}
                readOnly  // 수동 입력 방지
              />
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-gap-2 mt-1 mb-2">
            <GridHeader
              title="재해유형(대분류)"
              span={6}
              className="d-flex justify-content-start"
            />

            <GridHeader
              title="기인요인(중분류)"
              span={6}
              className="d-flex justify-content-start"
            />

            <div className="tw-col-span-6 d-flex justify-content-start mt-1">
            <select
          data-theme="light"
          className="px-2 tw-select tw-select-xs tw-select-bordered tw-min-w-52"
          value={matrixData[process?.name]?.ACCIDENT_TYPE || ''}
          onChange={handleAccidentTypeChange}
          ids="ACCIDENT_TYPE"
        >
          <option value="" disabled>재해유형 선택</option>
          {accidentTypes.map(type => (
            <option key={type.id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
            </div>

            <div className="tw-col-span-6 d-flex justify-content-start mt-1 mb-2">
            <select
          data-theme="light"
          className="px-2 tw-select tw-select-xs tw-select-bordered tw-min-w-52"
          value={matrixData[process?.name]?.CAUSE_TYPE || ''}
          onChange={handleCauseTypeChange}
          disabled={!selectedAccidentType}
          ids="CAUSE_TYPE"
        >
          <option value="" disabled>기인요인 선택</option>
          {causeTypes.map(cause => (
            <option key={cause.id} value={cause.name}>
              {cause.name}
            </option>
          ))}
        </select>
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-gap-2 mt-1 mb-2 w-100">
            <GridHeader
              title="현재 위험성"
              span={12}
              className="d-flex justify-content-start"
            />
          </div>

          <div className="tw-grid tw-grid-cols-12 mt-1 mb-2 w-100 tw-border-t tw-border-l tw-border-t-gray-300 tw-border-l-gray-300">
            <div className="tw-col-span-3 tw-font-semibold tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300">
              최소중대성
            </div>
            <div className="tw-col-span-3 tw-font-semibold tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300">
              가능성(A)
            </div>
            <div className="tw-col-span-3 tw-font-semibold tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300">
              중대성(B)
            </div>
            <div className="tw-col-span-3 tw-font-semibold tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300">
              위험성(AxB)
            </div>

            {/* 최소중대성 */}
            <div className="tw-col-span-3 tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300 d-flex align-items-center justify-content-center">
              <span className="tw-text-red-500">10</span>
            </div>

            {/* 가능성(A) */}
            <div className="tw-col-span-3 tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300 d-flex align-items-center justify-content-center">
              <select 
                className="tw-select tw-select-xs tw-select-bordered w-100 mx-2 my-2"
                ids="CURRENT_PROBABILITY"
                onChange={handleProbabilityChange}
                value={matrixData[process?.name]?.CURRENT_PROBABILITY || ''}
              >
                <option value="" disabled>가능성 선택</option>
                <option value="1">1 - 년 1회</option>
                <option value="2">2 - 반기 1회</option>
                <option value="3">3 - 분기 1회</option>
                <option value="4">4 - 월 1회</option>
                <option value="5">5 - 주 1회</option>
                <option value="6">6 - 1일 1회</option>
              </select>
            </div>

            {/* 중대성(B) */}
            <div className="tw-col-span-3 tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300 d-flex align-items-center justify-content-center">
              <select 
                className="tw-select tw-select-xs tw-select-bordered w-100 mx-2 my-2"
                ids="CURRENT_SEVERITY"
                onChange={handleSeverityChange}
                value={matrixData[process?.name]?.CURRENT_SEVERITY || ''}
              >
                <option value="" disabled>중대성 선택</option>
                <option value="1">1 - 영향없음</option>
                <option value="2">2 - 휴업3일미만</option>
                <option value="3">3 - 휴업3일이상</option>
                <option value="4">4 - 휴업1개월이상</option>
                <option value="5">5 - 휴업3개월이상</option>
              </select>
            </div>

            {/* 위험성(AxB) */}
            <div className="tw-col-span-3 tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300 d-flex align-items-center justify-content-center">
              <span className={getCurrentRisk() >= 10 ? 'tw-text-red-500' : ''}>
                {getCurrentRisk()}
              </span>
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-gap-2 mt-1 mb-2 w-100">
            <GridHeader
              title="개선 후 위험성"
              span={12}
              className="d-flex justify-content-start"
            />
          </div>

          <div className="tw-grid tw-grid-cols-12 mt-1 mb-2 w-100 tw-border-t tw-border-l tw-border-t-gray-300 tw-border-l-gray-300">
            <div className="tw-col-span-3 tw-font-semibold tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300">
              최소중대성
            </div>
            <div className="tw-col-span-3 tw-font-semibold tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300">
              가능성(A)
            </div>
            <div className="tw-col-span-3 tw-font-semibold tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300">
              중대성(B)
            </div>
            <div className="tw-col-span-3 tw-font-semibold tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300">
              위험성(AxB)
            </div>

            {/* 최소중대성 */}
            <div className="tw-col-span-3 tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300 d-flex align-items-center justify-content-center">
              <span className="tw-text-red-500">10</span>
            </div>

            {/* 가능성(A) */}
            <div className="tw-col-span-3 tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300 d-flex align-items-center justify-content-center">
              <select 
                className="tw-select tw-select-xs tw-select-bordered w-100 mx-2 my-2"
                ids="IMPROVED_PROBABILITY"
                onChange={handleImprovedProbabilityChange}
                value={matrixData[process?.name]?.IMPROVED_PROBABILITY || ''}
                disabled={!isRiskHighEnough()}
              >
                <option value="" disabled>가능성 선택</option>
                <option value="1">1 - 년 1회</option>
                <option value="2">2 - 반기 1회</option>
                <option value="3">3 - 분기 1회</option>
                <option value="4">4 - 월 1회</option>
                <option value="5">5 - 주 1회</option>
                <option value="6">6 - 1일 1회</option>
              </select>
            </div>

            {/* 중대성(B) */}
            <div className="tw-col-span-3 tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300 d-flex align-items-center justify-content-center">
              <select 
                className="tw-select tw-select-xs tw-select-bordered w-100 mx-2 my-2"
                value={matrixData[process?.name]?.IMPROVED_SEVERITY || ''}
                disabled
              >
                <option value={matrixData[process?.name]?.CURRENT_SEVERITY || ''}>
                  {matrixData[process?.name]?.CURRENT_SEVERITY 
                    ? `${matrixData[process?.name]?.CURRENT_SEVERITY} - ${getSeverityLabel(matrixData[process?.name]?.CURRENT_SEVERITY)}` 
                    : ''}
                </option>
              </select>
            </div>

            {/* 개선 후 위험성(AxB) */}
            <div className="tw-col-span-3 tw-border-r tw-border-b tw-border-r-gray-300 tw-border-b-gray-300 d-flex align-items-center justify-content-center">
              <span>{getImprovedRisk()}</span>
            </div>
          </div>
        </div>

        {/* 팝업의 구분선 */}
        <div className="tw-divider tw-divider-horizontal tw-divider-neutral tw-opacity-50"></div>

        {/* 팝업의 오른쪽 */}
        <div className="tw-flex tw-flex-col tw-w-full tw-h-full">
          <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-flex-1">
            <GridHeader
              title="작업내용"
              span={6}
              className="d-flex justify-content-start"
            />

            <GridHeader
              title="유해위험요인"
              span={6}
              className="d-flex justify-content-start"
            />

            <div className="tw-col-span-6 mt-1 mb-2 d-flex justify-content-start">
              <textarea
                className="tw-textarea tw-textarea-bordered tw-textarea-xs tw-resize-none w-100 tw-h-full"
                rows={10}
                ids="WORK_DETAILS"
                onChange={onInputChange}
                value={matrixData[process?.name]?.WORK_DETAILS || ''}
              ></textarea>
            </div>

            <div className="tw-col-span-6 mt-1 mb-2 d-flex justify-content-start">
              <textarea
                className="tw-textarea tw-textarea-bordered tw-textarea-xs tw-resize-none w-100 tw-h-full"
                rows={10}
                ids="HAZARD_FACTORS"
                onChange={onInputChange}
                value={matrixData[process?.name]?.HAZARD_FACTORS || ''}
              ></textarea>
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-flex-1">
            <GridHeader
              title="현재의 안전보건조치"
              span={6}
              className="d-flex justify-content-start"
            />

            <GridHeader
              title="개선대책"
              span={6}
              className="d-flex justify-content-start"
            />

            <div className="tw-col-span-6 mt-1 mb-2 d-flex justify-content-start">
              <textarea
                className="tw-textarea tw-textarea-bordered tw-textarea-xs tw-resize-none w-100 tw-h-full"
                rows={10}
                ids="CURRENT_MEASURES"
                onChange={onInputChange}
                value={matrixData[process?.name]?.CURRENT_MEASURES || ''}
              ></textarea>
            </div>

            <div className="tw-col-span-6 mt-1 mb-2 d-flex justify-content-start">
              <textarea
                className="tw-textarea tw-textarea-bordered tw-textarea-xs tw-resize-none w-100 tw-h-full"
                rows={10}
                ids="IMPROVEMENT_ACTIONS"
                onChange={onInputChange}
                value={matrixData[process?.name]?.IMPROVEMENT_ACTIONS || ''}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
