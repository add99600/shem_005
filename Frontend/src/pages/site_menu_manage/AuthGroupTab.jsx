import CardTemplate from "../template/card-template";
import {
  InplaceEditorTemplate,
  TwConfirmModal,
  apiCall,
  DataContext,
  TwSpan,
  TwGrid,
  TwSelect,
  useAPI,
} from "hanawebcore-frontend";
import { makeIds } from "../../utils/arrayUtil";
import React, { useState, useContext, useEffect } from "react";
import CreateAuthPopup from "./CreateAuthPopup";
import axios from "axios";
import MenuList from "./MenuList";

function AuthGroupContent() {
  /**
   * 변수 선언부
   */

  const [selectAuthId, setSelectAuthId] = useState(""); // 드롭다운에서 선택한 권한그룹 ID
  const [authGroupName, setAuthGroupName] = useState(""); // 드롭다운에서 선택한 권한그룹명
  const [dbRowID, setDbRowID] = useState(""); // GCM_CODE_DATA 테이블의 ID 컬럼(업데이트 때 필요)
  const [authGroupData, setAuthGroupData] = useState([]); // 권한그룹 데이터

  /**
   * 신규 등록 팝업용 변수 선언부
   */
  const [newAuthGroupId, setNewAuthGroupId] = useState(""); // 팝업에서 입력한 신규 권한그룹 ID
  const [newAuthGroupName, setNewAuthGroupName] = useState(""); // 팝업에서 입력한 신규 권한그룹명

  /**
   * DB 데이터 조회
   *
   * TwSelect에 들어갈 권한그룹 목록
   * DB -> getResponse (useAPI)
   * getResponse -> authGroupData 설정
   */
  const { response: getResponse } = useAPI(
    `${process.env.REACT_APP_BACK_HOST}/api/gcm/GCM_CODE_DATA`,
    "get"
  );

  useEffect(() => {
    if (getResponse) {
      const data = getResponse.data.filter(
        (item) => item.TOP_MENU === "권한그룹"
      );
      setAuthGroupData(data);
    }
  }, [getResponse]);

  /**
   * 팝업에서 확인 누를 때 핸들러
   *
   * GCM_CODE_DATA 테이블 { TOP_MENU: "권한그룹", DATA1: newAuthGroupId, DATA2: newAuthGroupName } 생성
   */
  const handleCreateAuthGroup = () => {
    try {
      if (newAuthGroupId === "" || newAuthGroupId === undefined) {
        return;
      }

      const { response, loading, error } = apiCall({
        endpoint: `${process.env.REACT_APP_BACK_HOST}/api/shem/GCM_CODE_DATA`,
        method: "post",
        payload: {
          TOP_MENU: "권한그룹",
          DATA1: newAuthGroupId,
          DATA2: newAuthGroupName,
        },
      });
    } catch (error) {}
  };

  /**
   * 권한그룹 명칭 및 데이터 수정 핸들러
   *
   *
   */

  const handleUpdateAuthGroup = () => {
    try {
      if (selectAuthId === "" || selectAuthId === undefined) {
        return;
      }

      axios.put(`${process.env.REACT_APP_BACK_HOST}/api/gcm/GCM_CODE_DATA`, {
        data: {
          TOP_MENU: "권한그룹",
          DATA1: selectAuthId,
          DATA2: authGroupName,
          ID: dbRowID,
        },
        id: dbRowID,
      });
    } catch (error) {}
  };

  /**
   * 권한그룹 ID 선택 시 DB ROW ID 설정하는 useEffect
   *
   * Select 선택 시 selectAuthId 변경될 때
   * authGroupData에서 해당 행의 DB ID 추출
   *
   */

  useEffect(() => {
    if (selectAuthId === "" || selectAuthId === undefined) {
      return;
    }

    // 전체 데이터인 authGroupData에서 selectAuthId와 일치하는 DATA1을 찾아 ID 설정
    setDbRowID(authGroupData.find((item) => item.DATA1 === selectAuthId).ID);
  }, [selectAuthId]);

  /**
   * Select에서 권한그룹 ID만 보여주는게 아닌 ID/권한그룹명 형태로 보여주기
   *
   */

  const _labelFormat = (item) => {
    if (item.DATA2 === undefined || item.DATA2 === null) {
      return `${item.DATA1}`;
    }

    return `${item.DATA1} / ${item.DATA2}`;
  };

  return (
    <CardTemplate
      contentClass="d-flex flex-column"
      CssClass="mt-3"
      CardBody={
        <>
          <div className="px-3 tw-grid tw-grid-cols-12" data-theme="light">
            <div className="mt-3 tw-col-span-12 d-flex align-items-center">
              <span className="tw-text-sm tw-font-semibold col-md-1">
                권한그룹 ID
              </span>
              <div class="col-md-10 tw-grid tw-grid-cols-12 ms-3">
                <div className="tw-col-span-5">
                  <TwSelect
                    defaultText="권한그룹 ID를 선택해주세요."
                    className="tw-select-sm w-100"
                    dataSet={authGroupData}
                    keyColumn="DATA1"
                    labelFormat={_labelFormat}
                    onChange={(e) => {
                      setSelectAuthId(e.target.value);
                    }}
                  />
                </div>
                <div className="tw-col-span-6 d-flex align-items-center ms-3">
                  <div>
                    <TwConfirmModal
                      openButtonText="신규권한그룹생성"
                      openButtonClassName="tw-btn-neutral tw-btn-sm"
                      title="신규권한그룹생성"
                      content={
                        <CreateAuthPopup
                          onAuthGroupIdChange={setNewAuthGroupId}
                          onAuthGroupNameChange={setNewAuthGroupName}
                        />
                      }
                      theme="light"
                      onAccept={handleCreateAuthGroup}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 tw-col-span-12 d-flex align-items-center">
              <span className="tw-text-sm tw-font-semibold col-md-1">
                권한그룹명
              </span>
              <div class="col-md-10 tw-grid tw-grid-cols-12 ms-3">
                <input
                  type="text"
                  className="tw-input tw-input-sm tw-input-bordered tw-col-span-5"
                  value={authGroupName}
                  onChange={(e) => {
                    setAuthGroupName(e.target.value);
                  }}
                />

                <button
                  className="tw-btn tw-btn-sm ms-3 tw-btn-neutral tw-col-span-1"
                  data-theme="light"
                  onClick={handleUpdateAuthGroup}
                >
                  저장
                </button>
              </div>
            </div>
            <div className="mt-5 mb-3 tw-col-span-6">
              <span className="tw-text-sm tw-font-semibold">메뉴 목록</span>
            </div>
            <div className="mt-5 mb-3 tw-col-span-6">
              <span className="tw-text-sm tw-font-semibold">사용자 목록</span>
            </div>
            <div className="tw-col-span-4 tw-border tw-border-gray-300">
              <MenuList className="mt-3 tw-h-96" />
            </div>
            <div className="tw-col-span-2"></div>
            <div className="tw-col-span-4 tw-border tw-border-gray-300">
              <MenuList className="mt-3 tw-h-96" />
            </div>
          </div>
        </>
      }
    ></CardTemplate>
  );
}

export default AuthGroupContent;
