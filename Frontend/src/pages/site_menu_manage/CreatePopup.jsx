import { useEffect, useState, useContext } from "react";
import { TextBoxTemplate, DataContext } from "hanawebcore-frontend";

export default function CreatePopup({ onAuthGroupIdChange }) {
  const { responseData = [] } = useContext(DataContext) || {};
  const [newAuthGroupId, setNewAuthGroupId] = useState("");

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
  }, [newAuthGroupId]);

  return (
    <div className="mt-5 vh-10">
      <TextBoxTemplate
        label="권한그룹 ID"
        placeholder="권한그룹 ID를 입력하세요."
        value={newAuthGroupId}
        change={(event) => {
          setNewAuthGroupId(event.value);
        }}
      />
    </div>
  );
}

export const CreateNewId = ({ onAuthGroupIdChange }) => {
  const { responseData = [] } = useContext(DataContext) || {};
  const [newAuthGroupId, setNewAuthGroupId] = useState("");

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
  }, [newAuthGroupId]);

  return (
    <div className="mt-5 vh-10">
      <TextBoxTemplate
        label="권한그룹 ID"
        placeholder="권한그룹 ID를 입력하세요."
        value={newAuthGroupId}
        change={(event) => {
          setNewAuthGroupId(event.value);
        }}
      />
    </div>
  );
};
