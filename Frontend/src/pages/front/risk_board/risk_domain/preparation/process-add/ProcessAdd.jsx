/**
 * 위험성 평가 사전준비 - 평가대상공정추가 카드
 *
 * ******** 사용 공용 컴포넌트 **********
 * RiskCard.jsx
 * ******** 사용 공용 컴포넌트 **********
 *
 */

import { RiskCard } from "../../../risk_component";
import { TwConfirmModal, TwIcon } from "hanawebcore-frontend";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CombinedDataContext } from "../../../risk_context/RiskProvider";

export const ProcessAddCard = () => {
  return (
    <RiskCard>
      <div className="d-flex flex-column">
        <div className="my-1">
          <span className="tw-text-lg tw-font-semibold">평가대상공정추가</span>
          <TwConfirmModal
            openButtonText="공정추가"
            openButtonClassName="tw-btn-neutral tw-btn-outline tw-btn-sm w-100 mt-2"
            closeIconClassName="tw-btn-neutral mt-2"
            acceptIconClassName="tw-btn-neutral"
            acceptText="추가"
            cancelText="취소"
            title="공정추가"
            content={<Content />}
            theme="light"
            modalContentClassName="tw-min-w-[50%] tw-max-w-[50%]"
          />
        </div>
      </div>
    </RiskCard>
  );
};

const Content = () => {
  const [processList, setProcessList] = useState([]); // 공정선택 리스트
  const [selectedProcess, setSelectedProcess] = useState([]); // 선택공정목록
  const { handleChildrenData, combinedData } = useContext(CombinedDataContext);

  const parseSelectedProcess = (processString) => {
    try {
      return Array.isArray(processString) ? processString : [];
    } catch {
      return [];
    }
  };

  // 공정 리스트 조회
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const top_Menu = "위험성평가";
        const data1 = "평가대상공정";
        const url = `${process.env.REACT_APP_BACK_HOST}/api/search/code/${top_Menu}/${data1}`;
        
        const response = await axios.get(url);
        if (!isMounted) return;

        const processData = response.data.data
          .map(item => ({
            id: item.ID,      // ID
            name: item.DATA2  // 공정명
          }))
          .sort((a, b) => a.id - b.id);  // ID 기준으로 오름차순 정렬
        
        setProcessList(processData);

        // combinedData에서 선택된 공정 데이터 가져오기
        const savedProcesses = parseSelectedProcess(combinedData.SELECTED_PROCESS);
        if (savedProcesses.length > 0) {
          const selectedItems = processData.filter(item => 
            savedProcesses.includes(item.name)
          );
          setSelectedProcess(selectedItems);
        }

      } catch (error) {
        console.error('Error:', error);
        setProcessList([]);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [combinedData.SELECTED_PROCESS]);


  const handleProcessChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const obj = processList.find((item) => item.id === selectedId);

    if (!obj) return;

    const { checked } = e.target;
    setSelectedProcess(prev => {
      const newSelected = checked 
        ? [...prev, obj]
        : prev.filter((process) => process.id !== selectedId);
      
      const processNames = newSelected.map(process => process.name);
      handleChildrenData('SELECTED_PROCESS', processNames);
      
      return newSelected;
    });
  };

  // 공정 제거
  const handleRemoveProcess = (id) => {
    setSelectedProcess(prev => {
      const newSelected = prev.filter((process) => process.id !== id);
      
      const processNames = newSelected.map(process => process.name);
      handleChildrenData('SELECTED_PROCESS', processNames);
      
      return newSelected;
    });
  };

  return (
    <div className="d-flex">
      <div className="col-md-4">
        <RiskCard>
          <div className="d-flex flex-column">
            <span className="tw-text-lg tw-font-semibold">공정선택</span>
            <div className="d-flex flex-column tw-min-h-[300px] tw-max-h-[300px] tw-border tw-rounded-md p-2 mt-2 tw-overflow-y-auto">
              {processList.map((item) => (
                <div key={item.id} className="py-1 d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="tw-checkbox tw-checkbox-sm"
                    value={item.id}
                    checked={selectedProcess.some(
                      (process) => process.id === item.id
                    )}
                    onChange={handleProcessChange}
                  />
                  <span className="tw-text-base ms-2">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </RiskCard>
      </div>
      <div className="col-md-4 d-flex justify-content-center align-items-center">
        <span className="tw-text-lg tw-font-semibold">검색리스트에서 선택</span>
      </div>
      <div className="col-md-4">
        <RiskCard>
          <div className="d-flex flex-column">
            <span className="tw-text-lg tw-font-semibold">선택공정목록</span>
            <div className="d-flex flex-column tw-min-h-[300px] tw-max-h-[300px] tw-border tw-rounded-md p-2 mt-2 tw-overflow-y-auto">
              {selectedProcess.map((process) => (
                <div key={process.id} className="py-1 d-flex align-items-center justify-content-between">
                  <span className="tw-text-base ms-2">{process.name}</span>
                  <TwIcon
                    name="xmark"
                    className="tw-text-base ms-2 tw-cursor-pointer"
                    onClick={() => handleRemoveProcess(process.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </RiskCard>
      </div>
    </div>
  );
};
