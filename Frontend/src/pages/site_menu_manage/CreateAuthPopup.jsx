import { useEffect, useState, useContext } from "react";
import { DataContext } from "hanawebcore-frontend";

export default function CreateAuthPopup({
  onAuthGroupIdChange,
  onAuthGroupNameChange,
}) {
  const { responseData = [] } = useContext(DataContext) || {};
  const [newAuthGroupId, setNewAuthGroupId] = useState("");
  const [newAuthGroupName, setNewAuthGroupName] = useState("");

  useEffect(() => {
    // 중복 체크
    const isDuplicated = responseData.some(
      (item) => item.DATA1 === newAuthGroupId
    );

    if (isDuplicated) {
      alert("이미 존재하는 권한그룹 ID입니다.");
      return;
    }

    onAuthGroupIdChange(newAuthGroupId);
    onAuthGroupNameChange(newAuthGroupName);
  }, [newAuthGroupId, newAuthGroupName]);

  return (
    <div className="mt-5 vh-10 tw-grid tw-grid-cols-12">
      <div className="d-flex align-items-center justify-content-center tw-col-span-3">
        <span className="mb-0 tw-text-sm tw-font-semibold">권한그룹 ID</span>
      </div>
      <div className="d-flex align-items-center tw-col-span-9">
        <input
          type="text"
          className="tw-input tw-input-sm tw-input-bordered w-100"
          value={newAuthGroupId}
          data-theme="light"
          onChange={(e) => {
            setNewAuthGroupId(e.target.value);
          }}
        />
      </div>
      <div className="d-flex align-items-center justify-content-center tw-col-span-3">
        <span className="mb-0 tw-text-sm tw-font-semibold">권한그룹명</span>
      </div>
      <div className="d-flex align-items-center tw-col-span-9">
        <input
          type="text"
          className="tw-input tw-input-sm tw-input-bordered w-100"
          value={newAuthGroupName}
          data-theme="light"
          onChange={(e) => {
            setNewAuthGroupName(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
