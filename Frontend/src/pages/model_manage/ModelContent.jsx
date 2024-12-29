import CardTemplate from "../template/card-template";
import { filterDuplicates } from "../../utils/arrayUtil";
import {
  useAPI,
  apiCall,
  TwGrid,
  TwSelect,
  TwConfirmModal,
} from "hanawebcore-frontend";
import AlertTemplate from "../template/alert-template";
import React, { useState, useEffect } from "react";
import CreatePopup from "./CreateModelPopup";
import AddGridDataPopup from "./AddGridDataPopup";

function ModelContent() {
  /**
   * 변수 선언부
   */

  const [originalModelArrayData, setOriginalModelArrayData] = useState([]); // 전체 DB 모델데이터
  const [modelArrayData, setModelArrayData] = useState([]); // 전체 DB 모델데이터 -> 모델ID 중복 제거
  const [selectModelId, setSelectModelId] = useState(""); // Select에서 선택한 모델ID
  const [newModelId, setNewModelId] = useState(""); // 신규 모델ID
  const [modelDesc, setModelDesc] = useState(""); // 모델 설명
  const [modelGridData, setModelGridData] = useState([]); // 모델 그리드 데이터
  const [addGridData, setAddGridData] = useState({}); // 추가할 그리드 데이터

  /**
   * DB 데이터 조회
   *
   * DB -> modelArrayData (useAPI)
   * modelArrayData -> filterDuplicates -> 모델ID 중복 제거 (useEffect)
   *
   *
   *
   */
  const {
    response: getResponse,
    loading,
    error: HttpGetError,
  } = useAPI(`${process.env.REACT_APP_BACK_HOST}/api/shem/MENU_MODEL`, "get");

  useEffect(() => {
    if (getResponse) {
      setOriginalModelArrayData(getResponse.data);
      setModelArrayData(filterDuplicates(getResponse.data, "MODEL_ID"));
    }
  }, [getResponse]);

  /**
   * 모델 ID 팝업에서 ID 생성 후 저장 버튼 클릭 시 실행 핸들러
   */

  const handleCreateModel = () => {
    console.log(newModelId);
  };

  /**
   * Grid 추가 팝업에서 데이터 입력 후 저장 버튼 클릭 시 실행 핸들러
   */

  const handleAddGridData = () => {
    setAddGridData((prev) => ({ ...prev, MODEL_ID: selectModelId }));
    setModelGridData((prev) => [...prev, addGridData]);
    console.log(addGridData);
  };

  return (
    <CardTemplate
      CardBody={
        <>
          <div className="col-lg-12 control-section">
            <div class="d-flex align-items-center mb-5">
              <p class="mb-0 col-md-1">모델 ID 검색</p>
              <div class="col-md-11 tw-grid tw-grid-cols-12">
                <div className="tw-col-span-4">
                  <TwSelect
                    defaultText="모델 ID를 선택해주세요."
                    className="tw-select-sm w-100"
                    dataSet={modelArrayData}
                    keyColumn="MODEL_ID"
                    labelFormat={(item) =>
                      item.MODEL_ID + " / " + item.MODEL_DESC
                    }
                    onChange={(e) => {
                      setSelectModelId(e.target.value);
                      setModelGridData(
                        originalModelArrayData.filter(
                          (item) => item.MODEL_ID === e.target.value
                        )
                      );
                    }}
                  />
                </div>
                <div className="tw-col-span-6 d-flex align-items-center ms-3">
                  <div>
                    <TwConfirmModal
                      openButtonText="신규모델ID생성"
                      openButtonClassName="tw-btn-primary tw-btn-sm"
                      title="신규모델ID생성"
                      content={<CreatePopup onModelIdChange={setNewModelId} />}
                      theme="cupcake"
                      onAccept={handleCreateModel}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex align-items-center mb-3">
              <p class="mb-0 col-md-1">모델 설명</p>
              <div class="col-md-11 tw-grid tw-grid-cols-12">
                <div className="tw-col-span-4">
                  <input
                    type="text"
                    className="tw-input tw-input-sm tw-input-bordered w-100"
                    data-theme="light"
                    value={modelDesc}
                    onChange={(e) => setModelDesc(e.target.value)}
                  />
                </div>
                <div className="tw-col-span-2">
                  <button
                    className="tw-btn tw-btn-sm ms-3 tw-btn-primary"
                    data-theme="cupcake"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
            <div class="py-3">
              <div className="pb-3 d-flex align-items-center">
                <span className="tw-text-base tw-font-semibold">필드정보</span>
                <TwConfirmModal
                  openButtonText="추가"
                  openButtonClassName="tw-btn-primary tw-btn-sm ms-3"
                  title="Grid Data 추가"
                  content={<AddGridDataPopup onGridAdd={setAddGridData} />}
                  theme="light"
                  onAccept={handleAddGridData}
                />
              </div>

              <TwGrid data={modelGridData} headers={modelGridHeader} />
            </div>
          </div>
        </>
      }
    ></CardTemplate>
  );
}

const modelGridHeader = {
  CONTROL_SEQ: {
    label: "순서",
    type: "text",
  },
  MENU_ID: {
    label: "DB 컬럼명",
    type: "text",
  },
  MENU_DD: {
    label: "View 컬럼명",
    type: "text",
  },
  WIDTH: {
    label: "셀 너비",
    type: "text",
  },
  SORTING: {
    label: "정렬",
    type: "text",
  },
  FORMAT: {
    label: "날짜포맷",
    type: "text",
  },
  TEMPLATE: {
    label: "VIEW 형식",
    type: "text",
  },
  EDIT_TEMPLATE: {
    label: "수정 형식",
    type: "text",
  },
};

export default ModelContent;
