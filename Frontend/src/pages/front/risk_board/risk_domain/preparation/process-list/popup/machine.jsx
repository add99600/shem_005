/**
 * 설비 목록 팝업
 */

import { TwConfirmModal, TwIcon } from "hanawebcore-frontend";
import { GridHeader, RiskCard } from "../../../../risk_component";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CombinedDataContext } from "../../../../risk_context/RiskProvider";

export const MachineListPopup = ({ processName }) => {
  return (
    <TwConfirmModal
      openButtonText="설비선택"
      openButtonClassName="tw-btn-neutral tw-btn-sm"
      closeIconClassName="tw-btn-neutral mt-2"
      acceptIconClassName="tw-btn-neutral"
      acceptText="선택"
      cancelText="취소"
      title={`설비 목록 - ${processName}`}
      content={<Content processName={processName} />}
      theme="light"
      modalContentClassName="tw-min-w-[50%] tw-max-w-[50%]"
    />
  );
};

const Content = ({ processName }) => {
  const [machineList, setMachineList] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState([]);

  const [partList, setPartList] = useState([]); // 파트 목록
  const [selectedPart, setSelectedPart] = useState(''); // 선택된 파트
  const [machineQuantities, setMachineQuantities] = useState({}); // 수량 정보
  const { combinedData, handleChildrenData } = useContext(CombinedDataContext);
  

  useEffect(() => {
    let top_Menu = "위험성평가";
    let data1 = "설비선택";
    const url = `${process.env.REACT_APP_BACK_HOST}/api/search/code/${top_Menu}/${data1}`;
    
    axios.get(url)
      .then((res) => {
        const machineData = res.data.data.map(item => ({
          id: item.ID,
          part: item.DATA2,  // 부서명
          name: item.DATA3   // 설비명
        }));

        // 중복 제거된 파트 목록 생성
        const uniqueParts = [...new Set(machineData.map(item => item.part))];
        setPartList(uniqueParts);
        
        // 전체 설비 목록 저장
        setMachineList(machineData);
        
        // 첫 번째 파트 선택
        if (uniqueParts.length > 0) {
          setSelectedPart(uniqueParts[0]);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

    // 파트 선택 핸들러
    const handlePartChange = (e) => {
      setSelectedPart(e.target.value);
    };
  
    // 선택된 파트에 해당하는 설비 목록 필터링
    const filteredMachineList = machineList.filter(
      machine => machine.part === selectedPart
    );
  

    const handleMachineChange = (e) => {
      const selectedId = Number(e.target.value);
      const machine = machineList.find((item) => item.id === selectedId);
  
      if (!machine) return;
  
      const { checked } = e.target;
      
      // 이미 선택된 설비인지 확인
      const isAlreadySelected = selectedMachine.some(item => item.id === selectedId);
  
      setSelectedMachine(prev => {
        // 체크 해제 시
        if (!checked) {
          const newSelected = prev.filter((item) => item.id !== selectedId);
          
          // 체크 해제된 설비의 수량 정보 삭제
          const newQuantities = { ...machineQuantities };
          delete newQuantities[machine.name];
          setMachineQuantities(newQuantities);
          
          updateContext(newSelected, newQuantities);
          return newSelected;
        }
        
        // 체크 시
        if (!isAlreadySelected) {
          const newSelected = [...prev, machine];
          updateContext(newSelected, machineQuantities);
          return newSelected;
        }
        
        return prev;
      });
    };

  // 수량 변경 핸들러
  const handleQuantityChange = (machineName, quantity) => {
    setMachineQuantities(prev => {
      const newQuantities = {
        ...prev,
        [machineName]: quantity
      };
      
      // context 업데이트
      updateContext(selectedMachine, newQuantities);
      return newQuantities;
    });
  };

  const updateContext = (machines = selectedMachine, quantities = machineQuantities) => {
    const machineData = machines.map(machine => ({
      name: machine.name,
      quantity: quantities[machine.name] || ''
    }));

    // 현재 공정의 설비 데이터만 업데이트
    const currentMachines = combinedData.SELECTED_MACHINES || {};
    handleChildrenData('SELECTED_MACHINES', {
      ...currentMachines,
      [processName]: machineData
    });
  };

  // 컴포넌트 마운트 시 현재 공정의 설비 데이터 로드
  useEffect(() => {
    const currentMachines = combinedData.SELECTED_MACHINES || {};
    const processMachines = currentMachines[processName] || [];
    
    const machinesWithIds = processMachines.map(machine => {
      const fullMachine = machineList.find(m => m.name === machine.name);
      return {
        ...machine,
        id: fullMachine?.id || machine.id,
        part: fullMachine?.part || machine.part
      };
    });
    
    setSelectedMachine(machinesWithIds);

    const quantities = {};
    processMachines.forEach(machine => {
      quantities[machine.name] = machine.quantity;
    });
    setMachineQuantities(quantities);
  }, [processName, combinedData.SELECTED_MACHINES, machineList]);


  return (
    <>
      <div className="tw-grid tw-grid-cols-12 tw-gap-5">
        <GridHeader title="설비선택" span={8} />
        <GridHeader title="설비정보입력" span={4} />
      </div>

      <div className="mt-2 tw-grid tw-grid-cols-12 tw-gap-5">
        <div className="tw-col-span-8">
          <div className="d-flex flex-column">
            <select 
              className="tw-select tw-select-bordered tw-select-sm"
              value={selectedPart}
              onChange={handlePartChange}
            >
              {partList.map((part, index) => (
                <option key={index} value={part}>
                  {part}
                </option>
              ))}
            </select>

            <RiskCard className="mt-2" bodyClassName="p-3">
              <div className="d-flex flex-column tw-min-h-[300px] tw-max-h-[300px] tw-border tw-rounded-md tw-overflow-y-auto">
                {filteredMachineList.map((item) => (
                  <div key={item.id} className="py-1 d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="tw-checkbox tw-checkbox-sm"
                      value={item.id}
                      checked={selectedMachine.some(
                        (machine) => machine.id === item.id
                      )}
                      onChange={handleMachineChange}
                    />
                    <span className="tw-text-base ms-2">{item.name}</span>
                  </div>
                ))}
              </div>
            </RiskCard>
          </div>
        </div>

        <div className="tw-col-span-4">
          <div className="d-flex flex-column">
            <select className="tw-select tw-select-bordered tw-select-sm tw-invisible">
              <option disabled>hidden</option>
            </select>

            {selectedMachine.map((item) => (
        <RiskCard key={item.id} className="mt-2" bodyClassName="p-2">
          <div className="tw-text-sm tw-font-semibold">{item.name}</div>
          <div className="d-flex align-items-center">
            <span>수량</span>
            <input
              type="number"
              data-theme="light"
              className="tw-input tw-input-bordered tw-input-sm ms-3"
              value={machineQuantities[item.name] || ''}
              onChange={(e) => handleQuantityChange(item.name, e.target.value)}
            />
          </div>
        </RiskCard>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
