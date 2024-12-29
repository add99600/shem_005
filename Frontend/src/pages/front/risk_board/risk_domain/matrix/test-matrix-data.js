import { useContext } from 'react';
import { CombinedDataContext } from "../../risk_context/RiskProvider";

export const MatrixDataComponent = ({ process }) => {
  const { matrixData } = useContext(CombinedDataContext);
  
  // process.name에 해당하는 데이터를 배열로 변환
  const currentMatrixData = process?.name ? [matrixData[process.name]] : [];

  console.log('currentMatrixData', currentMatrixData);
  
  return currentMatrixData;
};

// export const matrixData = [
//   {
//     작업내용: "작업내용입니다",
//     평가구분: "1",
//     유해위험요인: "유해위험요인입니다",
//     최소중대성: "10",
//     현재위험성: {
//       가능성: 2,
//       위험성: 3,
//     },
//   },
//   {
//     작업내용: "작업내용입니다",
//     평가구분: "2",
//     유해위험요인: "유해위험요인입니다",
//     최소중대성: "5",
//   },
//   {
//     작업내용: "작업내용입니다",
//     평가구분: "3",
//     유해위험요인: "유해위험요인입니다",
//     최소중대성: "3",
//   },
// ];
