import axios from "axios";

export const fetchMatrixDetailData = async () => {
    try {
      // 재해유형과 기인요인 데이터 가져오기
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_HOST}/api/search/code/위험성평가/재해유형`
      );
  
      // 재해유형(DATA2) 중복 제거
      const uniqueAccidentTypes = Array.from(
        new Set(response.data.data.map(item => item.DATA2))
      ).map(name => {
        const item = response.data.data.find(i => i.DATA2 === name);
        return {
          id: item.ID,
          name: name,
          // 해당 재해유형에 속하는 모든 기인요인 목록
          causeTypes: response.data.data
            .filter(i => i.DATA2 === name)
            .map(i => ({
              id: i.ID,
              name: i.DATA3
            }))
            .sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'))
        };
      }).sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
  
      return {
        accidentTypes: uniqueAccidentTypes
      };
      
    } catch (error) {
      console.error('Error fetching data:', error);
      return {
        accidentTypes: []
      };
    }
  };