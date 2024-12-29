/**
 * 위험성 평가 탭
 *
 * 탭 순서는 tabData의 순서대로 렌더링됩니다
 *
 * @param {Array} tabData - 탭 데이터
 * @param {Number} activeIndex - 현재 탭 인덱스
 * @param {Function} onTabChange - 탭 변경 함수
 * @param {ReactNode} children - 탭 컨텐츠
 * @param {String} className - 탭 컨테이너 클래스명
 * @returns
 */

export const RiskTab = ({
  tabData,
  activeIndex = 0,
  onTabChange,
  children,
  className,
}) => {
  return (
    <div className={className}>
      <div role="tablist" className={`tw-tabs tw-tabs-bordered d-flex `}>
        {tabData.map((tab, index) => (
          <div
            role="tab"
            key={index}
            onClick={() => onTabChange(index)}
            className={`tw-tab ${
              activeIndex === index
                ? "tw-tab-active tw-text-black tw-font-semibold"
                : ""
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
};
