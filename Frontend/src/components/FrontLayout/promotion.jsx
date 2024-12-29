import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

function Promotion() {
  const [promotionData, setPromotionData] = useState([]); 

    // 게시판 경로 설정
    const getBoardPath = (sectionTitle) => {
      switch(sectionTitle) {
        case "사전안전작업신고":
          return "/she/safety/work";
        case "화학물질사용신고":
          return "/she/safety/chemical";
        case "공지사항":
          return "/she/safety/notification";
        default:
          return "/";
      }
    };
  
    // 게시판 이동 핸들러
    const handleBoardClick = (sectionTitle) => {
      const path = getBoardPath(sectionTitle);
      window.location.href = path;
    };

  useEffect(() => {
    let params = {
      board1: "dev_test_shem005",
      board2: "shem002_new",
      board3: "she_notice_new"
    }
    
    axios.get(`${process.env.REACT_APP_BACK_HOST}/api/board/list/main`, {params})
      .then((res) => {
        if (res.data.success) {
          // 데이터를 board_type별로 그룹화
          const groupedData = res.data.data.reduce((acc, [title, date, boardType]) => {
            if (!acc[boardType]) {
              acc[boardType] = [];
            }
            acc[boardType].push({ title, date });
            return acc;
          }, {});

          // 데이터 설정
          setPromotionData({
            sections: [
              {
                title: "사전안전작업신고",
                items: (groupedData.board1 || []).map(item => ({
                  text: item.title
                }))
              },
              {
                title: "화학물질사용신고",
                items: (groupedData.board2 || []).map(item => ({
                  text: item.title
                }))
              },
              {
                title: "공지사항",
                items: (groupedData.board3 || []).map(item => ({
                  text: item.title
                }))
              }
            ]
          });
        }
      })
      .catch((error) => {
        console.error("데이터 로딩 실패:", error);
      });
  }, []);

  return (
    <div className="container-fluid p-0">
      <div id="promotions" className="section-container bg-light py-5">
        <div className="container">
        <div className="border-bottom mb-3">
          <h5 className="m-0 p-2">하나마이크론 / 협력사</h5>
        </div>
          <div className="row g-4">
            {promotionData.sections?.map((section, index) => (
              <div key={index} className="col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-white border-bottom-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0 fw-bold">{section.title}</h5>
                      <button 
                        className="btn btn-outline-secondary btn-sm rounded-circle"
                        onClick={() => handleBoardClick(section.title)}
                      >
                        <i className="fa fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <ul className="list-group list-group-flush">
                    {section.items.map((item, itemIndex) => (
                       <li 
                         key={itemIndex} 
                         className={`list-group-item border-0 ${itemIndex % 2 === 0 ? 'bg-light' : ''}`}
                       >
                        <a className="text-decoration-none text-secondary d-flex align-items-center">
                          <span className="text-truncate">
                            {item.text}
                          </span>
                        </a>
                       </li>
                     ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Promotion;