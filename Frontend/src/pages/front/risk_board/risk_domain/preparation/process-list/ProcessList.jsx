/**
 * 위험성 평가 사전준비 - 공정목록 카드
 *
 * ******** 사용 공용 컴포넌트 **********
 * RiskCard.jsx
 * ******** 사용 공용 컴포넌트 **********
 *
 */

import { useState, useContext } from "react";
import { CombinedDataContext } from '../../../risk_context/RiskProvider';

import { GridHeader, RiskCard } from "../../../risk_component";
import { TwIcon, TwChips } from "hanawebcore-frontend";
import { MachineListPopup } from "./popup/machine";
import { MaterialListPopup } from "./popup/material";

export const ProcessListCard = () => {
  const { combinedData, handleChildrenData } = useContext(CombinedDataContext);
  const selectedProcessList = combinedData.SELECTED_PROCESS || [];
  const selectedMachines = combinedData.SELECTED_MACHINES || [];
  const processDescriptions = combinedData.PROCESS_DESCRIPTIONS || {};  // 공정 설명

  const handleDescriptionChange = (processName, description) => {
    handleChildrenData('PROCESS_DESCRIPTIONS', {
      ...processDescriptions,
      [processName]: description
    });
  };

  const handleRemoveMachine = (labelObj, processName) => {    
    const processMachines = selectedMachines[processName] || [];
    const updatedProcessMachines = processMachines.filter(
      machine => machine.name !== labelObj.label
    );
    
    handleChildrenData('SELECTED_MACHINES', {
      ...selectedMachines,
      [processName]: updatedProcessMachines
    });
  };

  const getMaterialsForProcess = (processName) => {
    const machines = selectedMachines[processName] || [];
    const materials = [];

    machines.forEach(machine => {
      if (machine.materials) {
        machine.materials.forEach(material => {
          materials.push({
            label: material.item || material.name, // item 또는 name 속성 사용
            value: material.id,
            machineId: machine.name // 어떤 설비의 물질인지 저장
          });
        });
      }
    });

    return materials;
  };

  const handleRemoveMaterial = (labelObj, processName) => {
    const currentMachines = [...(selectedMachines[processName] || [])];
    
    // 해당 물질이 포함된 설비 찾기
    const machineIndex = currentMachines.findIndex(
      machine => machine.name === labelObj.machineId
    );

    if (machineIndex !== -1) {
      // 설비에서 해당 물질 제거
      currentMachines[machineIndex] = {
        ...currentMachines[machineIndex],
        materials: (currentMachines[machineIndex].materials || []).filter(
          material => (material.item || material.name) !== labelObj.label
        )
      };

      // context 업데이트
      handleChildrenData('SELECTED_MACHINES', {
        ...selectedMachines,
        [processName]: currentMachines
      });
    }
  };

  const handleRemoveProcess = (processToRemove) => {
    // SELECTED_PROCESS 업데이트
    const updatedProcessList = selectedProcessList.filter(
      processName => processName !== processToRemove
    );
    handleChildrenData('SELECTED_PROCESS', updatedProcessList);

    // PROCESS_DESCRIPTIONS 업데이트
    const updatedDescriptions = { ...processDescriptions };
    delete updatedDescriptions[processToRemove];
    handleChildrenData('PROCESS_DESCRIPTIONS', updatedDescriptions);
  };

  return (
    <>
      {selectedProcessList.map((processName, index) => (
        <RiskCard 
          key={index}
          topContent={
            <TopContent 
              title={processName} 
              onRemove={() => handleRemoveProcess(processName)} 
            />
          }
        >
          <div className="d-flex flex-column">
            <GridHeader title="해당 작업 공정 설명" />
            <input
              type="text"
              className="mt-1 tw-input tw-input-bordered tw-input-sm"
              data-theme="light"
              value={processDescriptions[processName] || ''}
              onChange={(e) => handleDescriptionChange(processName, e.target.value)}
            />
  
            <div className="mt-3 tw-grid tw-grid-cols-12">
              <GridHeader
                title={
                  <div className="d-flex align-items-center">
                    <span className="tw-font-semibold tw-text-base tw-text-gray-500 me-3">
                      설비(필수)
                    </span>
                    <MachineListPopup processName={processName}/>
                  </div>
                }
                span={12}
              />
  
              <div className="mt-2 tw-col-span-12">
                <TwChips
                  useX={true}
                  badgeClassName="tw-badge-outline tw-cursor-pointer me-2 mt-2"
                  dataArray={(selectedMachines[processName] || []).map(machine => ({
                    label: machine.name,
                    value: machine.name
                  }))}
                  keyProp="label"
                  onRemove={(labelObj) => handleRemoveMachine(labelObj, processName)}
                />
              </div>
            </div>
  
            <div className="mt-3 tw-grid tw-grid-cols-12">
              <GridHeader
                title={
                  <div className="d-flex align-items-center">
                    <span className="tw-font-semibold tw-text-base tw-text-gray-500 me-3">
                      물질(필수)
                    </span>
                    <MaterialListPopup processName={processName}/>
                  </div>
                }
                span={12}
              />
  
              <div className="mt-2 tw-col-span-12">
              <TwChips
                useX={true}
                badgeClassName="tw-badge-outline tw-cursor-pointer me-2 mt-2"
                dataArray={getMaterialsForProcess(processName)}
                keyProp="label"
                onRemove={(labelObj) => handleRemoveMaterial(labelObj, processName)}
              />
              </div>
            </div>
          </div>
        </RiskCard>
      ))}
    </>
  );
};

const TopContent = ({ title, onRemove }) => {
  return (
    <div className="py-2 d-flex justify-content-between align-items-center tw-bg-slate-300 tw-rounded-t-2xl tw-px-8">
      <span className="tw-text-lg tw-font-semibold tw-text-blue-700">
        {title}
      </span>

      <TwIcon
        name="xmark"
        className="tw-text-lg tw-font-semibold tw-bg-transparent"
        onClick={onRemove}
      />
    </div>
  );
};