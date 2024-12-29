import { useEffect, useState, useContext } from "react";

export default function AddGridDataPopup({ onGridAdd }) {
  /**
   * ClassName
   */
  const inputClassName = "tw-input tw-input-sm tw-input-bordered tw-col-span-9";
  const divClassName = "tw-grid tw-grid-cols-12";
  const labelClassName = "tw-col-span-3 tw-font-semibold tw-text-base";

  const onChange = (key, value) => {
    onGridAdd((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="gap-3 py-3 d-flex flex-column">
      <div className={divClassName}>
        <label className={labelClassName}>순서</label>
        <input
          className={inputClassName}
          type="number"
          onChange={(e) => {
            onChange("CONTROL_SEQ", e.target.value);
          }}
        />
      </div>
      <div className={divClassName}>
        <label className={labelClassName}>DB컬럼명</label>
        <input
          className={inputClassName}
          type="text"
          onChange={(e) => onChange("MENU_ID", e.target.value)}
        />
      </div>
      <div className={divClassName}>
        <label className={labelClassName}>View컬럼명</label>
        <input
          className={inputClassName}
          type="text"
          onChange={(e) => onChange("MENU_DD", e.target.value)}
        />
      </div>
      <div className={divClassName}>
        <label className={labelClassName}>셀 너비</label>
        <input
          className={inputClassName}
          type="text"
          onChange={(e) => onChange("WIDTH", e.target.value)}
        />
      </div>
      <div className={divClassName}>
        <label className={labelClassName}>정렬</label>
        <input
          className={inputClassName}
          type="text"
          onChange={(e) => onChange("SORTING", e.target.value)}
        />
      </div>
      <div className={divClassName}>
        <label className={labelClassName}>날짜포맷</label>
        <input
          className={inputClassName}
          type="text"
          onChange={(e) => onChange("FORMAT", e.target.value)}
        />
      </div>
    </div>
  );
}
