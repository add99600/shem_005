export const GridHeader = ({ title, span, className }) => {
  const style = "tw-font-semibold tw-text-base tw-text-gray-500";

  const renderTitle = () => {
    // title이 문자열이면 span으로, 아니면 컴포넌트 그대로 출력
    return typeof title === "string" ? (
      <span className={style}>{title}</span>
    ) : (
      title
    );
  };

  if (span) {
    return (
      <>
        <div className={`tw-col-span-${span} ${className}`}>
          {renderTitle()}
        </div>
      </>
    );
  }

  return (
    <>
      <div className={`tw-col-span-1 ${className}`}>{renderTitle()}</div>
      <div className="tw-col-span-3"></div>
    </>
  );
};
