import React from "react";
import axios from "axios";


function Slider1() {
  const [sliderData, setSliderData] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACK_HOST}/api/file/slider`).then((res) => {
      setSliderData(res.data);
    });
  }, []);


  return (
    <div id="slider" class="section-container p-0 bg-dark">
      <div id="main-carousel" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
          <div
            class="carousel-item active"
            data-paroller="true"
            data-paroller-factor="0.3"
            data-paroller-factor-sm="0.01"
            data-paroller-factor-xs="0.01"
            style={{
              background: `url(${process.env.REACT_APP_URL}/front-assets/assets/img/slider/slider-1-cover.jpg) center 0 / cover no-repeat`,
            }}
          >
            <div class="container">
              <img
                src="../assets/img/slider/slider-1-product.png"
                class="product-img right bottom animate__fadeInRight animate__animated"
                alt=""
              />
            </div>
            <div class="carousel-caption carousel-caption-left text-white">
              <div class="container">
                <h3 class="title mb-5px animate__fadeInLeftBig animate__animated">
                  iMac
                </h3>
                <p class="mb-15px animate__fadeInLeftBig animate__animated">
                  The vision is brighter than ever.
                </p>
                <div class="price mb-30px animate__fadeInLeftBig animate__animated">
                  <small>from</small> <span>$2299.00</span>
                </div>
                <a
                  href="product_detail.html"
                  class="btn btn-outline btn-lg animate__fadeInLeftBig animate__animated"
                >
                  Buy Now
                </a>
              </div>
            </div>
          </div>
          <div
            class="carousel-item"
            data-paroller="true"
            data-paroller-factor="-0.3"
            data-paroller-factor-sm="0.01"
            data-paroller-factor-xs="0.01"
            style={{
              background: `url(${process.env.REACT_APP_URL}/front-assets/assets/img/slider/slider-2-cover.jpg) center 0 / cover no-repeat`,
            }}
          >
            <div class="container">
              <img
                src="../assets/img/slider/slider-2-product.png"
                class="product-img left bottom animate__fadeInLeft animate__animated"
                alt=""
              />
            </div>
            <div class="carousel-caption carousel-caption-right text-white">
              <div class="container">
                <h3 class="title mb-5px animate__fadeInRightBig animate__animated">
                  iPhone X
                </h3>
                <p class="mb-15px animate__fadeInRightBig animate__animated">
                  Say hello to the future.
                </p>
                <div class="price mb-30px animate__fadeInRightBig animate__animated">
                  <small>from</small> <span>$1,149.00</span>
                </div>
                <a
                  href="product_detail.html"
                  class="btn btn-outline btn-lg animate__fadeInRightBig animate__animated"
                >
                  Buy Now
                </a>
              </div>
            </div>
          </div>
          <div
            class="carousel-item"
            data-paroller="true"
            data-paroller-factor="-0.3"
            data-paroller-factor-sm="0.01"
            data-paroller-factor-xs="0.01"
            style={{
              background: `url(${process.env.REACT_APP_URL}/front-assets/assets/img/slider/slider-3-cover.jpg) center 0 / cover no-repeat`,
            }}
          >
            <div class="carousel-caption text-white">
              <div class="container">
                <h3 class="title mb-5px animate__fadeInDownBig animate__animated">
                  Macbook Air
                </h3>
                <p class="mb-15px animate__fadeInDownBig animate__animated">
                  Thin.Light.Powerful.
                  <br />
                  And ready for anything
                </p>
                <div class="price animate__fadeInDownBig animate__animated">
                  <small>from</small> <span>$999.00</span>
                </div>
                <a
                  href="product_detail.html"
                  class="btn btn-outline btn-lg animate__fadeInUpBig animate__animated"
                >
                  Buy Now
                </a>
              </div>
            </div>
          </div>
        </div>
        <a
          class="carousel-control-prev"
          href="#main-carousel"
          data-bs-slide="prev"
        >
          <i class="fa fa-angle-left"></i>
        </a>
        <a
          class="carousel-control-next"
          href="#main-carousel"
          data-bs-slide="next"
        >
          <i class="fa fa-angle-right"></i>
        </a>
      </div>
    </div>
  );
}

export default Slider1;
