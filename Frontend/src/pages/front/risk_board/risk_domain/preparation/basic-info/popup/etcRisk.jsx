/**
 * 위험성 평가 사전준비 - 평가 기본정보 카드 - 기타 유해위험정보 입력
 *
 * 여러 라디오, 체크박스 포함
 * 작업환경 첨부파일 다운로드 기능 포함
 */

import { TwConfirmModal, TwRadio } from "hanawebcore-frontend";
import { GridHeader } from "../../../../risk_component";
import { useState, useContext, useEffect } from "react";
import { CombinedDataContext } from "../../../../risk_context/RiskProvider";

export const EtcRiskPopup = () => {
  return (
    <TwConfirmModal
      openButtonText="입력하기"
      openButtonClassName="tw-btn-neutral tw-btn-sm"
      closeIconClassName="tw-btn-neutral mt-2"
      acceptIconClassName="tw-btn-neutral"
      acceptText="입력"
      cancelText="취소"
      title="기타 유해위험정보 입력"
      content={<Content />}
      theme="light"
      modalContentClassName="tw-min-w-[40%] tw-max-w-[40%]"
    />
  );
};

const Content = () => {
  /**
   * 근로자 구성 및 경력 특성 체크박스 데이터
   */
  const workerCheckData = [
    { label: "여성근로자", value: "1" },
    { label: "1년미만 미숙련자", value: "2" },
    { label: "고령근로자", value: "3" },
    { label: "비정규직근로자", value: "4" },
    { label: "외국인근로자", value: "5" },
    { label: "장애근로자", value: "6" },
  ];
  // 체크한 값 배열
  const [checkWorker, setCheckWorker] = useState([]);
  const { combinedData } = useContext(CombinedDataContext);

  const parseJsonArray = (jsonString) => {
    try {
      return JSON.parse(jsonString) || [];
    } catch {
      return [];
    }
  };
  
  return (
    <>
      <RadioWithAction
        title="최근 3년간 재해발생 사례"
        radioName="recent-accident"
        displayComponent={Input}
        displayComponentProps={{ placeholder: "사례를 입력해주세요." }}
        ids="RECENT_ACCIDENT"
        defaultYN={combinedData.RECENT_ACCIDENT_YN}  // Y/N 값
        defaultValue={combinedData.RECENT_ACCIDENT_DESC}  // 설명 텍스트
      />
      <RadioWithAction
        title="아차사고 발생 사례"
        radioName="mistake-accident"
        displayComponent={Input}
        displayComponentProps={{ placeholder: "사례를 입력해주세요." }}
        ids="MISTAKE_ACCIDENT"
        defaultYN={combinedData.MISTAKE_ACCIDENT_YN}
        defaultValue={combinedData.MISTAKE_ACCIDENT_DESC}
      />
      <CheckGroup
        title="근로자 구성 및 경력 특성"
        checkData={workerCheckData}
        onChange={(e) => {
          const value = e.target.value;
          setCheckWorker((prev) => [...prev, value]);
        }}
        ids="WORKER_CHECK"
        defaultChecked={parseJsonArray(combinedData.WORKER_CHECK)}  // JSON 문자열을 배열로 변환
      />
      <RadioWithAction
        title="교대작업"
        radioName="exchange-work"
        displayComponent={Input}
        displayComponentProps={{ placeholder: "ex) 3조 2교대" }}
        ids="EXCHANGE_WORK"
        defaultYN={combinedData.EXCHANGE_WORK_YN}
        defaultValue={combinedData.EXCHANGE_WORK_DESC}
      />

      {/* 운반수단은 돌려쓰는 컴포넌트화로 분리 못 함 */}
      <Transport 
        ids="TRANSPORT" 
        defaultMachineYN={combinedData.TRANSPORT_MACHINE_YN}
        defaultMachineDesc={combinedData.TRANSPORT_MACHINE_DESC}
        defaultHumanYN={combinedData.TRANSPORT_HUMAN_YN}
        defaultHumanDesc={combinedData.TRANSPORT_HUMAN_DESC}
      />

      {/* 중량물 인력 취급 시 단위중량(5kg) 및 취급형태는 컴포넌트화 분리 못 함 */}
      <Weight 
        ids="WEIGHT" 
        defaultTypes={parseJsonArray(combinedData.WEIGHT_TYPES)}
        defaultValue={combinedData.WEIGHT_VALUE}
      />

      {/* 작업환경 측정유무 */}
      <Measurement 
        ids="MEASUREMENT"
        defaultStatus={combinedData.MEASUREMENT_STATUS}
        defaultDesc={combinedData.MEASUREMENT_DESC}
      />

      {/* 작업에 대한 특별 안전교육 필요 유무 */}
      <SpecialEducation 
        ids="SPECIAL_EDUCATION"
        defaultYN={combinedData.SPECIAL_EDUCATION_YN}
        defaultTypes={parseJsonArray(combinedData.SPECIAL_EDUCATION_TYPES)}
      />
    </>
  );
};

const RadioWithAction = ({
  title,
  radioName,
  displayComponent: DisplayComponent,
  displayComponentProps,
  ids, 
  defaultYN,  // Y/N 기본값
  defaultValue  // 입력값 기본값
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultYN);
  const [display, setDisplay] = useState(defaultYN === 'Y');
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const { handleChildrenData } = useContext(CombinedDataContext);

    // props가 변경될 때 상태 업데이트
    useEffect(() => {
      setSelectedValue(defaultYN);
      setDisplay(defaultYN === 'Y');
      setInputValue(defaultValue);
    }, [defaultYN, defaultValue]);

  // 라디오 버튼 변경 핸들러
  const handleRadioChange = (value) => {
    setSelectedValue(value);
    setDisplay(value === 'Y');
    handleChildrenData(`${ids}_YN`, value);
    
    if (value === 'N') {
      setInputValue('');
      handleChildrenData(`${ids}_DESC`, '');
    }
  };

  return (
    <>
      <div className="tw-grid tw-grid-cols-12 pt-3">
        <GridHeader title={title} span={12} className="mb-2" />
        <div className="tw-col-span-1 d-flex align-items-center">
          <TwRadio
            label="유"
            className="d-flex align-items-center"
            radioClassName="me-1 tw-radio-sm"
            name={radioName}
            value="Y"
            checked={selectedValue === 'Y'}
            onChange={() => handleRadioChange('Y')}
          />
        </div>
        <div className="tw-col-span-2 d-flex align-items-center">
          <TwRadio
            label="무"
            className="d-flex align-items-center"
            radioClassName="me-1 tw-radio-sm"
            name={radioName}
            value="N"
            checked={selectedValue === 'N'}
            onChange={() => handleRadioChange('N')}
          />
        </div>
        <div className="tw-col-span-9 d-flex align-items-center">
          {display && (
            <DisplayComponent 
              {...displayComponentProps}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                handleChildrenData(`${ids}_DESC`, e.target.value);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

const Input = ({ placeholder, ids, value, onChange }) => {
  const { handleChildrenData } = useContext(CombinedDataContext);

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // 상위 컴포넌트의 onChange가 있다면 호출
    if (onChange) {
      onChange(e);
    }
    
    // context로 데이터 전달 (ids가 있을 경우에만)
    if (ids) {
      handleChildrenData(ids, value);
    }
  };

  return (
    <input
      type="text"
      className="tw-input tw-input-xs tw-input-bordered w-80"
      placeholder={placeholder}
      value={value || ''}
      onChange={handleInputChange}
    />
  );
};

const CheckGroup = ({ title, checkData, ids, defaultChecked = [] }) => {
  const { handleChildrenData } = useContext(CombinedDataContext);
  const [selectedLabels, setSelectedLabels] = useState([]);

    // props 변경 시 상태 업데이트
    useEffect(() => {
      setSelectedLabels(defaultChecked);
    }, [defaultChecked]);

    const handleCheckboxChange = (e) => {
      const value = e.target.value;
      const isChecked = e.target.checked;
      const label = checkData.find(item => item.value === value)?.label;
  
      if (label) {
        setSelectedLabels(prev => {
          const newLabels = isChecked 
            ? [...prev, label]
            : prev.filter(l => l !== label);
          
          handleChildrenData(ids, JSON.stringify(newLabels));
          return newLabels;
        });
      }
    };

    return (
      <>
        <div className="tw-grid tw-grid-cols-12 pt-3">
          {title && <GridHeader title={title} span={12} className="mb-2" />}
          {checkData.map((item) => (
            <div key={item.value} className="tw-col-span-4 d-flex align-items-center">
              <input
                type="checkbox"
                className="tw-checkbox tw-checkbox-sm"
                id={`${ids}_${item.value}`}
                value={item.value}
                checked={selectedLabels.includes(item.label)}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={`${ids}_${item.value}`} className="tw-label tw-label-sm">
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </>
    );
};

const Transport = ({ 
  ids,
  defaultMachineYN,
  defaultMachineDesc,
  defaultHumanYN,
  defaultHumanDesc
}) => {
  const [displayMachine, setDisplayMachine] = useState(defaultMachineYN === 'Y');
  const [displayHuman, setDisplayHuman] = useState(defaultHumanYN === 'Y');
  const [machineValue, setMachineValue] = useState(defaultMachineDesc || '');
  const [humanValue, setHumanValue] = useState(defaultHumanDesc || '');
  const { handleChildrenData } = useContext(CombinedDataContext);

    // props 변경 시 상태 업데이트
    useEffect(() => {
      setDisplayMachine(defaultMachineYN === 'Y');
      setDisplayHuman(defaultHumanYN === 'Y');
      setMachineValue(defaultMachineDesc || '');
      setHumanValue(defaultHumanDesc || '');
    }, [defaultMachineYN, defaultMachineDesc, defaultHumanYN, defaultHumanDesc]);
  

  // 체크박스 상태 변경 핸들러
  const handleCheckboxChange = (type, checked) => {
    if (type === 'machine') {
      setDisplayMachine(checked);
      // 체크박스 상태를 context에 전달
      handleChildrenData(`${ids}_MACHINE_YN`, checked ? 'Y' : 'N');
      if (!checked) {
        setMachineValue('');
        handleChildrenData(`${ids}_MACHINE_DESC`, '');
      }
    } else {
      setDisplayHuman(checked);
      // 체크박스 상태를 context에 전달
      handleChildrenData(`${ids}_HUMAN_YN`, checked ? 'Y' : 'N');
      if (!checked) {
        setHumanValue('');
        handleChildrenData(`${ids}_HUMAN_DESC`, '');
      }
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (type, value) => {
    if (type === 'machine') {
      setMachineValue(value);
      handleChildrenData(`${ids}_MACHINE_DESC`, value);
    } else {
      setHumanValue(value);
      handleChildrenData(`${ids}_HUMAN_DESC`, value);
    }
  };

  return (
    <>
      <div className="tw-grid tw-grid-cols-12 pt-3">
        <GridHeader title="운반수단" span={12} className="mb-2" />
        <div className="tw-col-span-3 d-flex align-items-center">
          <input
            type="checkbox"
            className="tw-checkbox tw-checkbox-sm"
            id={`${ids}_machine`}
            checked={displayMachine}
            onChange={(e) => {
              setDisplayMachine(e.target.checked);
              handleChildrenData(`${ids}_MACHINE_YN`, e.target.checked ? 'Y' : 'N');
              if (!e.target.checked) {
                setMachineValue('');
                handleChildrenData(`${ids}_MACHINE_DESC`, '');
              }
            }}
          />
          <label htmlFor={`${ids}_machine`} className="tw-label tw-label-sm">
            기계
          </label>
        </div>
        <div className="tw-col-span-9 d-flex align-items-center">
          {displayMachine ? (
            <Input 
              placeholder="ex) 지게차, 전동파레트카, 전동리프트 등"
              value={machineValue}
              onChange={(e) => {
                setMachineValue(e.target.value);
                handleChildrenData(`${ids}_MACHINE_DESC`, e.target.value);
              }}
            />
          ) : (
            <span></span>
          )}
        </div>

        <div className="tw-col-span-3 d-flex align-items-center">
          <input
            type="checkbox"
            className="tw-checkbox tw-checkbox-sm"
            id={`${ids}_human`}
            checked={displayHuman}
            onChange={(e) => {
              setDisplayHuman(e.target.checked);
              handleChildrenData(`${ids}_HUMAN_YN`, e.target.checked ? 'Y' : 'N');
              if (!e.target.checked) {
                setHumanValue('');
                handleChildrenData(`${ids}_HUMAN_DESC`, '');
              }
            }}
          />
          <label htmlFor={`${ids}_human`} className="tw-label tw-label-sm">
            인력
          </label>
        </div>
        <div className="tw-col-span-9 d-flex align-items-center">
          {displayHuman && (
            <Input 
              placeholder="ex) 핸드파렛트카, 끌차, 인력운반(2인 1조) 등"
              value={humanValue}
              onChange={(e) => {
                setHumanValue(e.target.value);
                handleChildrenData(`${ids}_HUMAN_DESC`, e.target.value);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

const Weight = ({ ids, defaultTypes = [], defaultValue = '' }) => {
  const [selectedTypes, setSelectedTypes] = useState(defaultTypes);
  const [weightValue, setWeightValue] = useState(defaultValue);
  const { handleChildrenData } = useContext(CombinedDataContext);
  
  // props 변경 시 상태 업데이트
  useEffect(() => {
    setSelectedTypes(defaultTypes);
    setWeightValue(defaultValue);
  }, [defaultTypes, defaultValue]);

  const handleCheckboxChange = (type, checked) => {
    setSelectedTypes(prev => {
      const newTypes = checked 
        ? [...prev, type]
        : prev.filter(t => t !== type);
      
      handleChildrenData(`${ids}_TYPES`, JSON.stringify(newTypes));
      return newTypes;
    });
  };

  return (
    <>
      <div className="tw-grid tw-grid-cols-12 pt-3">
        <GridHeader
          title="중량물 인력 취급 시 단위중량(5kg) 및 취급형태"
          span={12}
          className="mb-2"
        />
        <div className="tw-col-span-1 d-flex align-items-center">
          <input
            type="checkbox"
            className="tw-checkbox tw-checkbox-sm"
            id="lifting"
            checked={selectedTypes.includes('들기')}
            onChange={(e) => handleCheckboxChange('들기', e.target.checked)}
          />
          <label htmlFor="lifting" className="tw-label tw-label-sm">
            들기
          </label>
        </div>
        <div className="tw-col-span-1 d-flex align-items-center">
          <input
            type="checkbox"
            className="tw-checkbox tw-checkbox-sm"
            id="pushing"
            checked={selectedTypes.includes('밀기')}
            onChange={(e) => handleCheckboxChange('밀기', e.target.checked)}
          />
          <label htmlFor="pushing" className="tw-label tw-label-sm">
            밀기
          </label>
        </div>
        <div className="tw-col-span-1 d-flex align-items-center">
          <input
            type="checkbox"
            className="tw-checkbox tw-checkbox-sm"
            id="pulling"
            checked={selectedTypes.includes('끌기')}
            onChange={(e) => handleCheckboxChange('끌기', e.target.checked)}
          />
          <label htmlFor="pulling" className="tw-label tw-label-sm">
            끌기
          </label>
        </div>
        <div className="tw-col-span-9 d-flex align-items-center">
          {selectedTypes.length > 0 && (
            <Input 
              placeholder="ex) 단위중량을 kg 단위 숫자로 입력"
              value={weightValue}
              onChange={(e) => {
                const value = e.target.value;
                setWeightValue(value);
                handleChildrenData(`${ids}_VALUE`, value);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

const Measurement = ({ ids, defaultStatus, defaultDesc }) => {
  const [selectedValue, setSelectedValue] = useState(defaultStatus);
  const [measurementValue, setMeasurementValue] = useState(defaultDesc || '');
  const { handleChildrenData } = useContext(CombinedDataContext);

  // props 변경 시 상태 업데이트
  useEffect(() => {
    setSelectedValue(defaultStatus);
    setMeasurementValue(defaultDesc || '');
  }, [defaultStatus, defaultDesc]);

  const handleRadioChange = (value) => {
    setSelectedValue(value);
    handleChildrenData(`${ids}_STATUS`, value);
    
    if (value !== 'Y') {
      setMeasurementValue('');
      handleChildrenData(`${ids}_DESC`, '');
    }
  };

  return (
    <>
      <div className="tw-grid tw-grid-cols-12 pt-3">
        <GridHeader
          title="작업환경 측정유무"
          span={3}
          className="d-flex align-items-center"
        />
        <div className="tw-col-span-9 d-flex align-items-center pb-2">
          <button className="tw-btn tw-btn-sm tw-btn-neutral">
            첨부파일다운
          </button>
        </div>
        <div className="tw-col-span-2 d-flex align-items-center">
          <TwRadio
            label="측정"
            name={`${ids}_radio`}
            className="d-flex align-items-center"
            radioClassName="me-1 tw-radio-sm"
            value="Y"
            checked={selectedValue === 'Y'}
            onChange={() => handleRadioChange('Y')}
          />
        </div>
        <div className="tw-col-span-2 d-flex align-items-center">
          <TwRadio
            label="미측정"
            name={`${ids}_radio`}
            className="d-flex align-items-center"
            radioClassName="me-1 tw-radio-sm"
            value="N"
            checked={selectedValue === 'N'}
            onChange={() => handleRadioChange('N')}
          />
        </div>
        <div className="tw-col-span-2 d-flex align-items-center">
          <TwRadio
            label="해당없음"
            name={`${ids}_radio`}
            radioClassName="me-1 tw-radio-sm"
            value="NA"
            checked={selectedValue === 'NA'}
            onChange={() => handleRadioChange('NA')}
          />
        </div>
        <div className="tw-col-span-5 d-flex align-items-center">
          {selectedValue === 'Y' && (
            <Input 
              placeholder="측정항목이 있을 경우 기입"
              value={measurementValue}
              onChange={(e) => {
                setMeasurementValue(e.target.value);
                handleChildrenData(`${ids}_DESC`, e.target.value);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

const SpecialEducation = ({ ids, defaultYN, defaultTypes = [] }) => {
  const [selectedValue, setSelectedValue] = useState(defaultYN);
  const [selectedTypes, setSelectedTypes] = useState(defaultTypes);
  const { handleChildrenData } = useContext(CombinedDataContext);

  const checkData = [
    { label: "보일러", value: "1" },
    { label: "유해화학물질취급자교육", value: "2" },
    { label: "밀폐공간 교육", value: "3" },
    { label: "압력용기", value: "4" },
    { label: "이산화탄소 소화설비 교육", value: "5" },
    { label: "방사선", value: "6" },
    { label: "정전교육 교육", value: "7" },
  ];

  // props 변경 시 상태 업데이트
  useEffect(() => {
    setSelectedValue(defaultYN);
    setSelectedTypes(defaultTypes);
  }, [defaultYN, defaultTypes]);

  const handleRadioChange = (value) => {
    setSelectedValue(value);
    handleChildrenData(`${ids}_YN`, value);

    if (value === 'N') {
      setSelectedTypes([]);
      handleChildrenData(`${ids}_TYPES`, JSON.stringify([]));
    }
  };

  const handleCheckboxChange = (label, checked) => {
    setSelectedTypes(prev => {
      const newTypes = checked
        ? [...prev, label]
        : prev.filter(t => t !== label);
      
      handleChildrenData(`${ids}_TYPES`, JSON.stringify(newTypes));
      return newTypes;
    });
  };

  return (
    <>
      <div className="tw-grid tw-grid-cols-12 pt-3">
        <GridHeader
          title="작업에 대한 특별 안전교육 필요 유무"
          span={12}
          className="mb-2"
        />
        <div className="tw-col-span-2 d-flex align-items-center">
          <TwRadio
            label="필요"
            name={`${ids}_radio`}
            className="d-flex align-items-center"
            radioClassName="me-1 tw-radio-sm"
            value="Y"
            checked={selectedValue === 'Y'}
            onChange={() => handleRadioChange('Y')}
          />
        </div>
        <div className="tw-col-span-2 d-flex align-items-center">
          <TwRadio
            label="불필요"
            name={`${ids}_radio`}
            className="d-flex align-items-center"
            radioClassName="me-1 tw-radio-sm"
            value="N"
            checked={selectedValue === 'N'}
            onChange={() => handleRadioChange('N')}
          />
        </div>
        <div className="tw-col-span-8"></div>
        {selectedValue === 'Y' && (
          <div className="tw-col-span-12 tw-grid tw-grid-cols-12 mt-2">
            {checkData.map((item) => (
              <div key={item.value} className="tw-col-span-4 d-flex align-items-center">
                <input
                  type="checkbox"
                  className="tw-checkbox tw-checkbox-sm"
                  id={`${ids}_${item.value}`}
                  checked={selectedTypes.includes(item.label)}
                  onChange={(e) => handleCheckboxChange(item.label, e.target.checked)}
                />
                <label htmlFor={`${ids}_${item.value}`} className="tw-label tw-label-sm">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};