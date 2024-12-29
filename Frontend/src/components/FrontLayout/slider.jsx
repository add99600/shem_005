import React, { useState, useEffect } from "react";
import axios from "axios";

function Slider() {
  const [sliderData, setSliderData] = useState([]);
  const top_menu = '메인페이지 이미지';

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACK_HOST}/api/images/loading/${top_menu}`)
    .then((res) => {
      console.log(res.data.data);
      if (res.data.success && res.data.data) {
        setSliderData(res.data.data);
      }
    })
    .catch((error) => {
      console.error("슬라이더 데이터 로딩 실패:", error);
    });
  }, []);

  const getImageUrl = (slide) => {
    return `${process.env.REACT_APP_BACK_HOST}/api/images/view/${encodeURIComponent(top_menu)}/${encodeURIComponent(slide.NAME)}`;
  };

  return (
    <header>
      <div className="container-fluid"> {/* container에서 container-fluid로 변경하여 전체 너비 사용 */}
        <div className="row gx-5 align-items-center justify-content-center">
          <div className="col-lg-12" style={{ 
            width: '1800px',
            height: '500px',
            padding: '0 10px'
          }}>
            <div id="main-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
              {/* Carousel Indicators */}
              <div className="carousel-indicators">
                {sliderData.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    data-bs-target="#main-carousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? 'active' : ''}
                    aria-current={index === 0 ? 'true' : 'false'}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                ))}
              </div>

              {/* Carousel Items */}
              <div className="carousel-inner">
                {sliderData.length > 0 ? (
                  sliderData.map((slide, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                      <img
                        src={getImageUrl(slide)}
                        className="d-block w-100"
                        style={{ 
                          height: '500px', 
                          objectFit: 'contain',
                          backgroundColor: '#f8f9fa'
                        }}
                        alt={`Slide ${index + 1}`}
                      />
                    </div>
                  ))
                ) : (
                  <div className="carousel-item active">
                    <div className="carousel-caption text-white">
                      <div className="container">
                        <h3>이미지를 불러오는 중...</h3>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Carousel Controls */}
              {sliderData.length > 1 && (
                <>
                  <button className="carousel-control-prev" type="button" data-bs-target="#main-carousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#main-carousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Slider;