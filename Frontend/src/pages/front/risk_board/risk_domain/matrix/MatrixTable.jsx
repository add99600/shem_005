/**
 * 위험성 평가표 테이블
 */

import { TwGrid } from "hanawebcore-frontend";
import { MatrixDataComponent } from "./test-matrix-data";
import { headers } from "./matrix-header";
import { MatrixDetailPopup } from "./popup/matrixDetail";

import { useEffect, useState, useContext } from "react";
import { fetchMatrixDetailData } from "./popup/matrixDetailData";
import { CombinedDataContext } from "../../risk_context/RiskProvider";

export const MatrixTable = ({ process, className }) => {
  const { matrixData, handleMatrixData } = useContext(CombinedDataContext);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [detailData, setDetailData] = useState({
    accidentTypes: [],
    causeTypes: []
  });

  // matrixDetailData.jsx 에서 데이터 가져오기
  useEffect(() => {
    const loadDetailData = async () => {
      const data = await fetchMatrixDetailData();
      setDetailData(data);
    };

    loadDetailData();
  }, []);

  const handleAddRow = () => {
    if (process?.name) {
      const newRow = {};
      const currentData = Array.isArray(matrixData[process.name]) 
        ? [...matrixData[process.name]] 
        : [];

      handleMatrixData(process.name, [...currentData, newRow]);
    }
  };

  // 행 선택 핸들러 추가
  const handleRowSelect = (rowData, index) => {
    setSelectedRowIndex(index);
  };

  // process.name에 해당하는 배열 데이터 가져오기
  const gridData = process?.name && Array.isArray(matrixData[process.name]) 
    ? matrixData[process.name]
    : [];

  return (
    <div className={className}>
      <div className="mb-2">
        <button 
          className="tw-btn tw-btn-sm tw-btn-primary"
          onClick={handleAddRow}
        >
          행 추가
        </button>
      </div>
      <TwGrid
        useCheckbox={true}
        useAutoNumber={false}
        data={gridData}
        headers={headers}
        tableClassName="w-100"
        useExpandRow={true}
        expandTrigger="popup"
        popupComponent={({ data, rowIndex }) => (  // data와 rowIndex를 객체 구조분해로 받기
          <MatrixDetailPopup 
            rowData={data}
            process={process}
            detailData={detailData}
            rowIndex={rowIndex}
          />
        )}
        useTdBorder={true}
        useTrBorder={true}
        useThBorder={true}
      />
    </div>
  );
};
