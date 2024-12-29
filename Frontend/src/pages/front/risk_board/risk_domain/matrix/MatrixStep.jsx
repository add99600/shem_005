/**
 * 위험성평가 표 작성 단계
 *
 *
 */

import { RiskCard, GridHeader } from "../../risk_component";
import { useEffect, useState } from "react";
import { MatrixBase } from "./MatrixBase";
import { MatrixTable } from "./MatrixTable";

export const MatrixStep = ({ selectedProcess }) => {
  const [title, setTitle] = useState("");

  console.log('selectedProcess', selectedProcess);

  useEffect(() => {

    setTitle(
      selectedProcess ?
        `${selectedProcess?.name} 위험성평가 표 작성` :
        "왼쪽에서 평가할 공정을 선택해주세요."
    );
  }, [selectedProcess]);

  return (
    <div className="tw-min-h-[50vh]">
      <div className="d-flex flex-column">
        <RiskCard>
          <div className="mb-2 tw-grid tw-grid-cols-12">
            <GridHeader title={title} span={12} />
          </div>

          <MatrixBase selectedProcess={selectedProcess} />
          <MatrixTable className="mt-2" process={selectedProcess} />
        </RiskCard>
      </div>
    </div>
  );
};
