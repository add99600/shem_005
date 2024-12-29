export const headers = {
  평가구분: {
    label: "평가구분",
    type: "text",
    width: "10%",
    viewTemplate: (value) => (
      <select
        value={value}
        data-theme="light"
        className="mx-2 tw-select tw-select-xs tw-select-ghost tw-appearance-none focus:tw-outline-none tw-pointer-events-none"
      >
        <option value="" disabled>
          평가구분
        </option>
        <option value="1">기계적</option>
        <option value="2">물질환경적</option>
        <option value="3">인적</option>
        <option value="4">관리적</option>
      </select>
    ),
  },

  작업내용: {
    label: () => (
      <span>
        작업내용
        <br />
        (공정순서)
      </span>
    ),
    type: "text",
    width: "20%",
  },

  유해위험요인: {
    label: "유해위험요인",
    type: "text",
    width: "20%",
  },

  재해유형: {
    label: () => (
      <span>
        재해유형
        <br />
        (대분류)
      </span>
    ),
    type: "text",
    width: "10%",
    viewTemplate: (value) => (
      <select
        value={value}
        data-theme="light"
        className="mx-2 tw-select tw-select-xs tw-select-ghost tw-appearance-none focus:tw-outline-none tw-pointer-events-none"
      >
        <option value="" disabled>
          대분류
        </option>
        <option value="1">끼임</option>
        <option value="2">떨어짐</option>
        <option value="3">부딪힘</option>
        <option value="4">넘어짐</option>
      </select>
    ),
  },

  기인요인: {
    label: () => (
      <span>
        기인요인
        <br />
        (중분류)
      </span>
    ),
    type: "text",
    width: "10%",
    viewTemplate: (value) => (
      <select
        value={value}
        data-theme="light"
        className="mx-2 tw-select tw-select-xs tw-select-ghost tw-appearance-none focus:tw-outline-none tw-pointer-events-none w-100"
      >
        <option value="" disabled>
          중분류
        </option>
        <option value="1">작업,취급물</option>
        <option value="2">중량물 운반</option>
        <option value="3">직선, 구동부</option>
        <option value="4">기타</option>
      </select>
    ),
  },

  최소중대성: {
    label: () => (
      <span>
        최소
        <br />
        중대성
      </span>
    ),
    type: "text",
    width: "5%",
    viewTemplate: (value) => (
      <span className="tw-text-red-500 tw-font-semibold">{value}</span>
    ),
  },

  // 현재위험성은 2개의 컬럼을 보여줘야 되서 객체로 받을 수 밖에 없습니다 !!!!!!!주의!!!!!!!
  현재위험성: {
    label: () => (
      <div className="d-flex flex-column">
        <div className="tw-border-b tw-border-gray-300 tw-pb-2">현재위험성</div>
        <div className="tw-grid tw-grid-cols-3 tw-gap-2">
          <div>가능성(A)</div>
          <div>위험성(B)</div>
          <div>중대성(AxB)</div>
        </div>
      </div>
    ),
    viewTemplate: (value) => (
      <div className="tw-grid tw-grid-cols-3 tw-gap-2">
        <div>{value?.가능성}</div>
        <div>{value?.위험성}</div>
        <div>{value?.가능성 * value?.위험성}</div>
      </div>
    ),
    type: "text",
    width: "15%",
  },
};
