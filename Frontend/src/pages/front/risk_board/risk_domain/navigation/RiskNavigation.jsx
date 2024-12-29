/**
 * 위험성평가 우측의 네비게이션 컴포넌트
 *
 * 다음단계, 이전단계, 저장, 평가기준 기능
 *
 * RiskBoard.jsx탭의 상태값, setter를 props로 받음
 *
 */

import { useState } from "react";
import SaveButton from '../../risk_component/SaveButton';  // 중괄호 제거

export const RiskNavigation = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNext = () => {
    if (activeTab < 4) {
      setActiveTab(activeTab + 1);
    }
  };
  const handlePrev = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };
  return (
    <div className="tw-fixed tw-bottom-12 tw-right-6">
      <div className="tw-relative">
        <label
          className="tw-btn tw-btn-circle tw-swap tw-swap-rotate tw-text-white"
          data-theme="dark"
        >
          <input
            type="checkbox"
            checked={isOpen}
            onChange={() => setIsOpen(!isOpen)}
          />
          {/* hamburger icon */}
          <svg
            className="tw-swap-off tw-fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>

          {/* close icon */}
          <svg
            className="tw-swap-on tw-fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>

          {/* 드롭다운 메뉴 */}
          <ul
            className="tw-absolute tw-bottom-full tw-right-0 tw-mb-5 tw-menu tw-p-2 tw-shadow tw-bg-base-100 tw-z-[9999] tw-rounded-box tw-w-32"
            style={{ display: isOpen ? "block" : "none" }}
          >
            <li>
              <button onClick={handlePrev} disabled={activeTab === 0}>
                이전단계
              </button>
            </li>
            <li>
              <button onClick={handleNext}>다음단계</button>
            </li>
            <li>
              <SaveButton />
            </li>
            <li>
              <button onClick={() => {}}>평가기준</button>
            </li>
          </ul>
        </label>
      </div>
    </div>
  );
};
