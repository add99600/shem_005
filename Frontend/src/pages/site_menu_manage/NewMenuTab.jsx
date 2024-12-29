import CardTemplate from "../template/card-template";

function NewMenuTab() {
  return (
    <CardTemplate
      contentClass="d-flex flex-column"
      CssClass="mt-3"
      CardBody={
        <>
          <div className="px-3 tw-grid tw-grid-cols-12" data-theme="light">
            <div className="mt-3 tw-col-span-12 d-flex align-items-center">
              <span className="tw-text-sm tw-font-semibold col-md-1">
                메뉴 ID
              </span>
              <input
                type="text"
                className="tw-input tw-input-sm tw-input-bordered col-md-4 ms-3"
              />
            </div>
            <div className="mt-3 tw-col-span-12 d-flex align-items-center">
              <span className="tw-text-sm tw-font-semibold col-md-1">
                메뉴명
              </span>
              <input
                type="text"
                className="tw-input tw-input-sm tw-input-bordered col-md-4 ms-3"
              />
            </div>
            <div className="mt-3 tw-col-span-12 d-flex align-items-center">
              <span className="tw-text-sm tw-font-semibold col-md-1">
                메뉴 유형
              </span>
              <select className="tw-select tw-select-sm tw-select-bordered col-md-4 ms-3">
                <option value="1">링크메뉴</option>
                <option value="2">드롭다운메뉴</option>
                <option value="3">드롭다운 풀 메뉴</option>
              </select>
            </div>
            <div className="mt-5 tw-col-span-12 d-flex align-items-center">
              <button className="tw-btn tw-btn-sm tw-btn-neutral">
                메뉴 추가
              </button>
            </div>
          </div>
        </>
      }
    />
  );
}

export default NewMenuTab;
