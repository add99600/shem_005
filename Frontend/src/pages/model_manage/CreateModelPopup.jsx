import { useEffect, useState, useContext } from "react";
import { TextBoxTemplate, DataContext } from "hanawebcore-frontend";

export default function CreatePopup({ onModelIdChange }) {
  const { responseData = [] } = useContext(DataContext) || {};
  const [newModelId, setNewModelId] = useState("");

  useEffect(() => {
    // 중복 체크
    const isDuplicated = responseData.some(
      (item) => item.MODEL_ID === newModelId
    );

    if (isDuplicated) {
      alert("이미 존재하는 모델 ID입니다. 다시 시도해주세요.");
      return;
    }

    onModelIdChange(newModelId);
  }, [newModelId]);

  return (
    <div className="mt-5 vh-10">
      <TextBoxTemplate
        label="신규모델 ID"
        placeholder="모델 ID를 입력하세요."
        value={newModelId}
        change={(event) => {
          setNewModelId(event.value);
        }}
      />
    </div>
  );
}
