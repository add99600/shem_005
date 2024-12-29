function CardTemplate({
  CardBody = "Card Body",
  CssClass = "h-100",
  contentClass: _contentClass,
}) {
  const contentClass = "control-pane " + _contentClass;

  return (
    <div className={`card ${CssClass}`}>
      <div className="card-body">
        <div className={`${contentClass}`}>{CardBody}</div>
      </div>
    </div>
  );
}

export default CardTemplate;
