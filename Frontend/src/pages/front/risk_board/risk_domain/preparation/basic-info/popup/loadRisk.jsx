/**
 * 위험성 평가 사전준비 - 평가 기본정보 카드 - 기존 위험성평가 불러오기 팝업
 *
 * 작성중인 위험성평가 조회 기능
 * 작성중인 위험성평가 클릭 시 전 데이터 로드
 * 작성완료된 위험성평가 참조 기능
 */

import { TwConfirmModal, TwIcon } from "hanawebcore-frontend";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../../../../contexts/AuthContext";
import { CombinedDataContext } from "../../../../risk_context/RiskProvider";

export const LoadRiskPopup = () => {
  return (
    <TwConfirmModal
      openButtonText="기존위험성평가 불러오기"
      openButtonClassName="tw-btn-neutral tw-btn-sm"
      closeIconClassName="tw-btn-neutral mt-2"
      acceptIconClassName="tw-btn-neutral"
      acceptText="불러오기"
      cancelText="취소"
      title="기존위험성평가 불러오기"
      content={<Content />}
      theme="light"
      modalContentClassName="tw-min-w-[50%] tw-max-w-[50%]"
    />
  );
};

const Content = () => {
  const [writingRiskData, setWritingRiskData] = useState([]);
  const [completedRiskData, setCompletedRiskData] = useState([
    // {
    //   id: 1,
    //   type: "수시평가",
    //   date: "2023-01-01",
    //   author: "작성자1",
    // },
  ]);
  const [shouldClose, setShouldClose] = useState(false);

  const { handleChildrenData } = useContext(CombinedDataContext);
  const { user } = useContext(AuthContext);

  let params = {};

  if (user) {
    params = { ...params, ...user };
  }

    // 데이터 로드 핸들러
    const handleLoadData = (selectedIndex) => {
      try {
        const selectedData = writingRiskData[selectedIndex].originalData;
        console.log('선택된 데이터:', selectedData);
  
        // API 응답의 원본 데이터로 combinedData 업데이트
        Object.entries(selectedData).forEach(([key, value]) => {
          handleChildrenData(key, value === null ? '' : value);
        });
  
        setShouldClose(true);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    };

  useEffect(() => {
    let isMounted = true;  // 컴포넌트 마운트 상태

    const fetchData = async () => {
      if (!user?.USER_ID) return;  // user가 없으면 리턴

      try {
        const url = `${process.env.REACT_APP_BACK_HOST}/api/risk/get/SAFETY_BASIC_NEW/${user.USER_ID}`;
        const response = await axios.get(url);
        
        if (isMounted) {
          const apiData = response.data.data.map(item => ({
            id: item.RISK_ID,
            type: item.EVAL_TYPE || '유형 미지정',
            date: item.UPDT_DT ? item.UPDT_DT.split('T')[0] : '날짜 미지정',
            author: item.ISRT_ID || '작성자 미지정',
            originalData: item
          }));

          // 기존 데이터와 API 데이터 합치기
          setWritingRiskData(prevList => [...prevList, ...apiData]);
        }
      } catch (error) {
        console.error('API 호출 실패:', error);
      }
    };

    fetchData();

    // 클린업 함수
    return () => {
      isMounted = false;  // 컴포넌트 언마운트 시 플래그 변경
    };
  }, [user]);

  /**
   *
   * 불러오기 테이블 그려주는 컴포넌트
   *
   * 스타일 돌려쓰는 목적
   *
   */

  // 테이블 스타일
  const thStyle = "tw-text-center tw-font-semibold tw-text-base";
  const tdStyle =
    "tw-text-center tw-text-sm d-flex align-items-center justify-content-center";

  const Title = ({ title }) => {
    return (
      <div className="tw-border-b tw-border-gray-300 mb-3">
        <span className="tw-font-semibold tw-text-base">{title}</span>
      </div>
    );
  };

  const Table = ({ data }) => {
    return (
      <>
        <div className={`tw-grid tw-grid-cols-12 w-100 pb-2`}>
          <div className={`tw-col-span-1 ${thStyle}`}>#</div>
          <div className={`tw-col-span-3 ${thStyle}`}>평가구분</div>
          <div className={`tw-col-span-4 ${thStyle}`}>작성일시</div>
          <div className={`tw-col-span-3 ${thStyle}`}>작성자</div>
          <div className={`tw-col-span-1 ${thStyle}`}>불러오기</div>
        </div>
        {data.length > 0 &&
          data.map((item, index) => (
            <div className="tw-grid tw-grid-cols-12 w-100 py-1">
              <div className={`tw-col-span-1 ${tdStyle}`}>{index + 1}</div>
              <div className={`tw-col-span-3 ${tdStyle}`}>{item.type}</div>
              <div className={`tw-col-span-4 ${tdStyle}`}>{item.date}</div>
              <div className={`tw-col-span-3 ${tdStyle}`}>{item.author}</div>
              <div className={`tw-col-span-1 ${tdStyle}`}>
                <TwIcon
                  name="download"
                  btnClassName="tw-btn-neutral tw-btn-xs"
                  theme="light"
                  onClick={() => handleLoadData(index)}  // 원본 데이터 전달
                />
              </div>
            </div>
          ))}
      </>
    );
  };

  return (
    <div className="d-flex flex-column pb-4">
      <div>
        <Title title="작성중인 위험성 평가" />
        <Table data={writingRiskData} />
      </div>

      <div className="mt-5">
        <Title title="작성완료된 위험성 평가" />
        <Table data={completedRiskData} />
      </div>
    </div>
  );
};
