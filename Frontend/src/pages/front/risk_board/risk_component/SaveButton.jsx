import { CombinedDataContext } from '../risk_context/RiskProvider';
import { AuthContext } from '../../../../contexts/AuthContext'
import React, { useContext } from 'react';
import axios from 'axios';

function SaveButton() {
  const { combinedData, handleChildrenData } = useContext(CombinedDataContext);
  const { user } = useContext(AuthContext);

  let params = {};

  if (user) {
    params = { ...params, ...user };
  }

  // 중간저장
  const handleClick = () => {
    let SendData = {
        ...combinedData,
        "UPDT_ID": user.USER_ID
      };

    // RISK_ID가 없는 경우 새로 생성
    if (!combinedData.RISK_ID) {
      const now = new Date();
      const riskId = now.getFullYear().toString() +
                    String(now.getMonth() + 1).padStart(2, '0') +
                    String(now.getDate()).padStart(2, '0') +
                    String(now.getHours()).padStart(2, '0') +
                    String(now.getMinutes()).padStart(2, '0') +
                    String(now.getSeconds()).padStart(2, '0') +
                    String(now.getMilliseconds()).padStart(3, '0');

      SendData = {
        ...SendData,
        "RISK_ID": riskId,
        "ISRT_ID": user.USER_ID,
      };

      handleChildrenData('RISK_ID', riskId);
      
      console.log('신규 저장:', SendData);
      axios.post('http://localhost:5000/api/risk/insert/SAFETY_BASIC_NEW', SendData)
        .then(response => {
          console.log('저장 요청 성공:', response.data);
        })
        .catch(error => {
          console.error('저장 요청 실패:', error);
        });
    } else {
        console.log('수정 저장:', SendData);
        axios.put(`http://localhost:5000/api/risk/update/SAFETY_BASIC_NEW/${combinedData.RISK_ID}`, SendData)
          .then(response => {
            console.log('수정 요청 성공:', response.data);
          })
          .catch(error => {
            console.error('수정 요청 실패:', error);
          });
        }
  };

  return (
    <button 
      onClick={handleClick}
      className="btn btn-primary"
      style={{ minWidth: '80px' }}
    >
      중간저장
    </button>
  );
}

export default SaveButton;