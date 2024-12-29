/**
 * 위험성 평가 사전준비 - 평가 기본정보 카드
 *
 * ******** 하위 팝업 **********
 * popup/기존 위험성평가 불러오기 팝업
 * popup/기타 유해정보입력 팝업
 * ******** 하위 팝업 **********
 *
 * ******** 사용 공용 컴포넌트 **********
 * RiskCard.jsx
 * GridHeader.jsx
 * ******** 사용 공용 컴포넌트 **********
 *
 *
 */

import { CombinedDataContext } from "../../../risk_context/RiskProvider";
import { RiskCard, GridHeader } from "../../../risk_component";
import { LoadRiskPopup } from "./popup/loadRisk";
import { EtcRiskPopup } from "./popup/etcRisk";
import { useEffect, useState, useContext } from "react";
import axios from "axios";

export const BasicInfoCard = () => {
  const [departments, setDepartments] = useState([]);
  const { handleChildrenData, combinedData } = useContext(CombinedDataContext) || {};
  

  // 평가부서 리스트
  useEffect(() => {
    let top_Menu = "위험성평가";
    let data1 = "평가부서";
    const url = `${process.env.REACT_APP_BACK_HOST}/api/search/code/${top_Menu}/${data1}`;
    
    axios.get(url)
      .then((res) => {
        const deptList = res.data.data
        .map(item => ({
          id: item.ID,      // ID
          name: item.DATA2  // 부서명
        }))
        .sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
        setDepartments(deptList);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  // BasicInfoCard 에서 전달받은 데이터 처리
  const handleChange = (e) => {
    const ids = e.target.getAttribute('ids');
    const value = e.target.value;
    console.log('Front에서 입력한 데이터:', ids, value);
    if (handleChildrenData) {
      handleChildrenData(ids, value);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];  // "2024-12-24" 형식으로 변환
  };

  return (
    <RiskCard>
      <div className="d-flex flex-column">
        <div className="mb-5 d-flex justify-content-between align-items-center">
          <span className="tw-text-lg tw-font-semibold">평가 기본정보</span>
          <LoadRiskPopup />
        </div>

        <div className="tw-grid tw-grid-cols-12 w-100 tw-gap-5">
          <GridHeader title="평가구분" />
          <GridHeader title="기타 유해위험정보 입력" span={8} />
        </div>

        <div className="tw-grid tw-grid-cols-12 w-100 mt-2 tw-gap-5">
          <div className="tw-col-span-4">
            <select
              className="tw-select tw-select-sm tw-select-bordered"
              data-theme="light"
              value={combinedData.EVAL_TYPE || ''}
              ids="EVAL_TYPE"
              onChange={handleChange}
              defaultValue=""
            >
              <option value="" disabled>
                평가구분 선택
              </option>
              <option value="최초평가">최초평가</option>
              <option value="정기평가">정기평가</option>
              <option value="수시평가">수시평가</option>
            </select>
          </div>

          <div className="tw-col-span-8">
            <EtcRiskPopup />
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-12 w-100 mt-3 tw-gap-5">
          <GridHeader title="평가부서" />
          <GridHeader title="평가기간" />
          <GridHeader title="평가번호" />
        </div>

        <div className="tw-grid tw-grid-cols-12 w-100 mt-2 tw-gap-5">
          <div className="tw-col-span-4">
          <select
            className="tw-select tw-select-sm tw-select-bordered"
            data-theme="light"
            value={combinedData.DEPT_NM || ''}
            ids="DEPT_NM"
            onChange={handleChange}
            defaultValue=""
          >
            <option value="" disabled>
              평가부서 선택
            </option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          </div>

          <div className="tw-col-span-4 d-flex align-items-center">
            <input
              type="date"
              className="tw-input tw-input-sm tw-input-bordered"
              data-theme="light"
              value={formatDate(combinedData.EVAL_START_DATE) || ''}
              ids="EVAL_START_DATE"
              onChange={handleChange}
            />
            <span className="mx-1">~</span>
            <input
              type="date"
              className="tw-input tw-input-sm tw-input-bordered"
              data-theme="light"
              value={formatDate(combinedData.EVAL_END_DATE) || ''}
              ids="EVAL_END_DATE"
              onChange={handleChange}
            />
          </div>

          <div className="tw-col-span-4">
            <input
              type="text"
              className="tw-input tw-input-sm tw-input-bordered w-100"
              data-theme="light"
              value={combinedData.RISK_ID || ''}
              disabled
              placeholder="위험성평가 등록 시 자동생성됩니다."
              ids="RISK_ID"
            />
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-12 w-100 mt-3 tw-gap-5">
          <GridHeader title="평가명" />
        </div>

        <div className="tw-grid tw-grid-cols-12 w-100 mt-2 tw-gap-5">
          <div className="tw-col-span-8">
            <input
              type="text"
              className="tw-input tw-input-sm tw-input-bordered w-100"
              data-theme="light"
              value={combinedData.EVAL_NAME || ''}
              ids="EVAL_NAME"
              onChange={handleChange}
            />
          </div>

          <div className="tw-col-span-5"></div>
        </div>

        <div className="tw-grid tw-grid-cols-12 w-100 mt-3 tw-gap-5">
          <GridHeader title="원재료" />
          <GridHeader title="생산품" />
          <GridHeader title="근로자수" />
        </div>

        <div className="tw-grid tw-grid-cols-12 w-100 mt-2 tw-gap-5">
          <div className="tw-col-span-4">
            <input
              type="text"
              className="tw-input tw-input-sm tw-input-bordered w-100"
              data-theme="light"
              value={combinedData.MATERIAL || ''}
              ids="MATERIAL"
              onChange={handleChange}
            />
          </div>

          <div className="tw-col-span-4">
            <input
              type="text"
              className="tw-input tw-input-sm tw-input-bordered w-100"
              data-theme="light"
              value={combinedData.PRODUCT || ''}
              ids="PRODUCT"
              onChange={handleChange}
            />
          </div>

          <div className="tw-col-span-4">
            <input
              type="number"
              className="tw-input tw-input-sm tw-input-bordered w-100"
              data-theme="light"
              value={combinedData.EMP_AMOUNT || ''}
              ids="EMP_AMOUNT"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </RiskCard>
  );
};
