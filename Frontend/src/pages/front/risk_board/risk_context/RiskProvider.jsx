import React, { createContext, useState, useEffect } from 'react';

export const CombinedDataContext = createContext();

function RiskProvider({ children }) {
    const [combinedData, setCombinedData] = useState({});
    const [matrixData, setMatrixData] = useState({});
  
    const handleChildrenData = (ids, value) => {
      setCombinedData(prevData => {
        const newData = {
          ...prevData,
          [ids]: value
        };
        console.log('업데이트된 ChildrenData:', newData);
        return newData;
      });
    };

    const handleMatrixData = (ids, value) => {
      setMatrixData(prevData => {
        const newData = {
          ...prevData,
          [ids]: value
        };
        console.log('업데이트된 MatrixData:', newData);
        return newData;
      });
    };
  
    // 상태 변화 감지를 위한 useEffect
    useEffect(() => {
      console.log('combined 최종 데이터:', combinedData);
    }, [combinedData]);

    useEffect(() => {
      console.log('matrix 최종 데이터:', matrixData);
    }, [matrixData]);
  
    return (
      <CombinedDataContext.Provider 
        value={{ handleChildrenData, handleMatrixData, combinedData, matrixData }}
      >
        {children}
      </CombinedDataContext.Provider>
    );
  }

export default RiskProvider;