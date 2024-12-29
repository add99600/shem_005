/**
 * 물질 목록 팝업
 */

import { TwConfirmModal, TwIcon } from "hanawebcore-frontend";
import { GridHeader, RiskCard } from "../../../../risk_component";
import { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { CombinedDataContext } from "../../../../risk_context/RiskProvider";

export const MaterialListPopup = ({ processName }) => {
  return (
    <TwConfirmModal
      openButtonText="물질선택"
      openButtonClassName="tw-btn-neutral tw-btn-sm"
      closeIconClassName="tw-btn-neutral mt-2"
      acceptIconClassName="tw-btn-neutral"
      acceptText="선택"
      cancelText="취소"
      title={`물질 목록 - ${processName}`}
      content={<Content processName={processName} />}
      theme="light"
      modalContentClassName="tw-min-w-[75%] tw-max-w-[75%]"
    />
  );
};

const Content = ({ processName }) => {
  const { combinedData, handleChildrenData } = useContext(CombinedDataContext);
  const [machineList, setMachineList] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState({});
  const [searchTerm, setSearchTerm] = useState('');  // 검색어
  const [filteredMaterialList, setFilteredMaterialList] = useState([]); // 필터링된 목록
  const [materialList, setMaterialList] = useState([]); // 물질목록

  // 현재 공정의 선택된 물질 목록 가져오기
  const selectedMaterial = useMemo(() => {
    if (!selectedMachine.id) return [];
    
    const currentMachines = combinedData.SELECTED_MACHINES || {};
    const processMachines = currentMachines[processName] || [];
    const machine = processMachines.find(m => m.name === selectedMachine.name);
    
    return machine?.materials || [];
  }, [selectedMachine, combinedData.SELECTED_MACHINES, processName]);


    // 설비목록 조회
    useEffect(() => {
      const currentMachines = combinedData.SELECTED_MACHINES || {};
      const processMachines = currentMachines[processName] || [];
      
      // context의 설비 데이터를 machineList 형식으로 변환
      const formattedMachines = processMachines.map((machine, index) => ({
        id: index + 1,  // 임시 ID 부여
        name: machine.name,
        part: machine.quantity || '',  // quantity를 part 위치에 표시
        materials: machine.materials || []
      }));
      
      setMachineList(formattedMachines);
    }, [combinedData.SELECTED_MACHINES, processName]);

    // 물질목록 조회
    useEffect(() => {
      let table = 'SHEM003';
      let id = 'ITEM_NM';
      axios.get(`http://localhost:5000/api/shem/where/${id}/${table}`)
      .then(response => {
        // API 응답 데이터를 materialList 형식으로 변환
        const formattedMaterials = response.data.data.map((item, index) => ({
          id: index + 1,
          name: item[0]  // 배열의 첫 번째 요소가 물질명
        }));
        
        setMaterialList(formattedMaterials);
        setFilteredMaterialList(formattedMaterials);
      })
      .catch(error => {
        console.error('Error fetching material data:', error);
      });
    }, []);

    // 설비 선택 핸들러
    const handleMachineChange = (e) => {
      const selectedId = parseInt(e.target.value, 10);
      setSelectedMachine(
        machineList.find((machine) => machine.id === selectedId) || {}
      );
    };

    // 물질 선택 핸들러
    const handleMaterialChange = (e) => {
      if (!selectedMachine.id) return;
  
      const selectedId = parseInt(e.target.value, 10);
      const material = materialList.find((item) => item.id === selectedId);
  
      if (!material) return;
  
      const currentMachines = combinedData.SELECTED_MACHINES || {};
      const processMachines = [...(currentMachines[processName] || [])];
      const machineIndex = processMachines.findIndex(m => m.name === selectedMachine.name);
  
      if (machineIndex === -1) return;
  
      if (e.target.checked) {
        // 체크 시 해당 설비의 물질 목록에 추가 (name 대신 item 사용)
        processMachines[machineIndex] = {
          ...processMachines[machineIndex],
          materials: [...(processMachines[machineIndex].materials || []), 
            { 
              id: material.id,
              item: material.name,  // name 대신 item으로 변경
              amount: '',
              unit: '',
              handleTime: ''
            }
          ]
        };
      } else {
        // 체크 해제 시 해당 설비의 물질 목록에서 제거
        processMachines[machineIndex] = {
          ...processMachines[machineIndex],
          materials: (processMachines[machineIndex].materials || []).filter(
            m => m.id !== selectedId
          )
        };
      }
  
      // context 업데이트
      handleChildrenData('SELECTED_MACHINES', {
        ...currentMachines,
        [processName]: processMachines
      });
    };

    // 물질 상세 정보 입력 핸들러
    const handleMaterialInfoChange = (materialId, field, value) => {
      if (!selectedMachine.id) return;

      const currentMachines = combinedData.SELECTED_MACHINES || {};
      const processMachines = [...(currentMachines[processName] || [])];
      const machineIndex = processMachines.findIndex(m => m.name === selectedMachine.name);

      if (machineIndex === -1) return;

      // 현재 설비의 materials 배열 가져오기
      const updatedMachine = { ...processMachines[machineIndex] };
      const materialIndex = updatedMachine.materials?.findIndex(m => m.id === materialId);

      if (materialIndex === -1) return;

      // 물질 정보 업데이트
      updatedMachine.materials = updatedMachine.materials.map(material => 
        material.id === materialId 
          ? { ...material, [field]: value }
          : material
      );

      // 업데이트된 설비 정보를 processMachines에 반영
      processMachines[machineIndex] = updatedMachine;

      // context 업데이트
      handleChildrenData('SELECTED_MACHINES', {
        ...currentMachines,
        [processName]: processMachines
      });
    };

  

    // 검색어 변경 핸들러
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };
  
    // 검색 버튼 클릭 핸들러
    const handleSearch = () => {
      if (!searchTerm.trim()) {
        // 검색어가 없으면 전체 목록 표시
        setFilteredMaterialList(materialList);
        return;
      }
  
      // 검색어를 포함하는 항목만 필터링
      const filtered = materialList.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setFilteredMaterialList(filtered);
    };
  
    // Enter 키 입력 시 검색 실행
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    // materialList가 변경될 때마다 filteredMaterialList 초기화
    useEffect(() => {
      setFilteredMaterialList(materialList);
    }, [materialList]);


  return (
    <>
      <div className="tw-grid tw-grid-cols-12 tw-gap-5">
        <GridHeader title="설비목록" span={2} />
        <GridHeader title="물질검색" span={4} />
        <GridHeader title="물질정보입력" span={6} />
      </div>

      <div className="mt-2 tw-grid tw-grid-cols-12 tw-gap-5">
        <div className="tw-col-span-2">
          <RiskCard className="mt-2" bodyClassName="p-3">
            <div className="d-flex flex-column tw-min-h-[300px] tw-max-h-[300px] tw-border tw-rounded-md tw-overflow-y-auto">
              {machineList.map((item) => (
                <div className="py-1 d-flex align-items-center">
                  <input
                    type="radio"
                    className="tw-radio tw-radio-sm"
                    value={item.id}
                    checked={selectedMachine.id === item.id}
                    onChange={handleMachineChange}
                    name="machine"
                  />
                  <span className="tw-text-base ms-2">{item.name}</span>
                </div>
              ))}
            </div>
          </RiskCard>
        </div>

        <div className="tw-col-span-4 d-flex flex-column">
          <div className="mt-2 d-flex align-items-center justify-content-between">
            <input
              type="text"
              className="tw-input tw-input-bordered tw-input-sm w-80"
              data-theme="light"
              placeholder="물질명을 입력하세요."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
            />
            <button className="tw-btn tw-btn-sm tw-btn-neutral" onClick={handleSearch}>검색</button>
          </div>

          <div className="mt-2 d-flex flex-column">
            <span className="tw-text-sm tw-font-semibold tw-text-gray-500">
              {`총 물질 ${materialList.length}건`}
            </span>

            <div className="d-flex flex-column tw-min-h-[300px] tw-max-h-[300px] tw-border tw-rounded-md tw-overflow-y-auto">
            {filteredMaterialList.map((item) => (
              <div key={item.id} className="py-1 d-flex align-items-center">
                <input
                  type="checkbox"
                  className="tw-checkbox tw-checkbox-sm"
                  value={item.id}
                  checked={selectedMachine.id && 
                    machineList.find(m => m.id === selectedMachine.id)?.materials?.some(
                      m => m.id === item.id
                    )}
                  onChange={handleMaterialChange}
                  disabled={!selectedMachine.id}
                />
                <span className="tw-text-sm ms-2">{item.name}</span>
              </div>
            ))}
            </div>
          </div>
        </div>

      {/* 물질 정보 입력 */}
      <div className="tw-col-span-6">
        {selectedMaterial.map((item) => (
          <RiskCard key={item.id} className="mt-2" bodyClassName="p-2">
            <div className="tw-text-sm tw-font-semibold">{item.item}</div>
            <div className="tw-grid tw-grid-cols-12 tw-gap-5">
              <div className="tw-col-span-2 d-flex align-items-center">
                <span>취급량/일</span>
              </div>
              <input
                type="number"
                data-theme="light"
                className="tw-input tw-input-bordered tw-input-sm tw-col-span-4"
                value={item.amount || ''}
                onChange={(e) => handleMaterialInfoChange(item.id, 'amount', e.target.value)}
              />
              <select 
                className="tw-select tw-select-bordered tw-select-sm tw-col-span-4"
                value={item.unit || ''}
                onChange={(e) => handleMaterialInfoChange(item.id, 'unit', e.target.value)}
              >
                <option value="" disabled>단위선택</option>
                <option value="1">cc(CC)</option>
                <option value="2">g(G)</option>
                <option value="4">gal(GA)</option>
                <option value="3">kg(KG)</option>
              </select>
            </div>

            <div className="tw-grid tw-grid-cols-12 tw-gap-5">
              <div className="tw-col-span-2 d-flex align-items-center">
                <span>취급시간</span>
              </div>
              <input
                type="number"
                data-theme="light"
                className="tw-input tw-input-bordered tw-input-sm tw-col-span-4"
                value={item.handleTime || ''}
                onChange={(e) => handleMaterialInfoChange(item.id, 'handleTime', e.target.value)}
              />
              <div className="tw-col-span-4 d-flex align-items-center">
                <span>분</span>
              </div>
            </div>
          </RiskCard>
        ))}
      </div>
      </div>
    </>
  );
};
