export const RiskCard = ({
  children,
  topContent,
  className,
  bodyClassName,
}) => {
  return (
    <div
      className={`tw-card tw-shadow-xl tw-border-t tw-border-t-gray-300 tw-border-l tw-border-l-gray-300 tw-border-r tw-border-r-gray-300 ${className}`}
    >
      {topContent}
      <div className={`tw-card-body ${bodyClassName}`}>{children}</div>
    </div>
  );
};
