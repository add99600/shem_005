function Promotion() {
    return (
      <div id="promotions" class="section-container bg-component">
        <div class="container">
          <h4 class="section-title clearfix">
            <span class="flex-1">
              Exclusive promotions
              <small>from 25 September 2024 - 1 January 2024</small>
            </span>
            <a href="#" class="btn">
              SHOW ALL
            </a>
          </h4>
          <div class="row gx-2">
            <div class="col-lg-6">
              <div class="promotion promotion-lg bg-dark">
                <div class="promotion-image text-end promotion-image-overflow-bottom">
                  <img src="../assets/img/product/product-iphone-12.png" alt="" />
                </div>
                <div class="promotion-caption promotion-caption-inverse">
                  <h4 class="promotion-title">iPhone 12</h4>
                  <div class="promotion-price">
                    <small>from</small> $1,299.00
                  </div>
                  <p class="promotion-desc">
                    A big step for small.
                    <br />A beloved design. Now with more to love.
                  </p>
                  <a href="#" class="promotion-btn">
                    View More
                  </a>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div class="promotion bg-blue">
                <div class="promotion-image promotion-image-overflow-bottom promotion-image-overflow-top">
                  <img
                    src="../assets/img/product/product-apple-watch-sm.png"
                    alt=""
                  />
                </div>
                <div class="promotion-caption promotion-caption-inverse text-end">
                  <h4 class="promotion-title">Apple Watch</h4>
                  <div class="promotion-price">
                    <small>from</small> $299.00
                  </div>
                  <p class="promotion-desc">You. At a glance.</p>
                  <a href="#" class="promotion-btn">
                    View More
                  </a>
                </div>
              </div>
              <div class="promotion bg-gray-200">
                <div class="promotion-image text-center promotion-image-overflow-bottom">
                  <img src="../assets/img/product/product-mac-mini.png" alt="" />
                </div>
                <div class="promotion-caption text-center">
                  <h4 class="promotion-title">Mac Mini</h4>
                  <div class="promotion-price">
                    <small>from</small> $199.00
                  </div>
                  <p class="promotion-desc">It’s mini in a massive way.</p>
                  <a href="#" class="promotion-btn">
                    View More
                  </a>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div class="promotion bg-gray-200">
                <div class="promotion-image promotion-image-overflow-right promotion-image-overflow-bottom text-end">
                  <img
                    src="../assets/img/product/product-mac-accessories.png"
                    alt=""
                  />
                </div>
                <div class="promotion-caption text-center">
                  <h4 class="promotion-title">Apple Accessories</h4>
                  <div class="promotion-price">
                    <small>from</small> $99.00
                  </div>
                  <p class="promotion-desc">
                    Redesigned. Rechargeable. Remarkable.
                  </p>
                  <a href="#" class="promotion-btn">
                    View More
                  </a>
                </div>
              </div>
              <div class="promotion bg-dark">
                <div class="promotion-image text-end">
                  <img src="../assets/img/product/product-mac-pro.png" alt="" />
                </div>
                <div class="promotion-caption promotion-caption-inverse">
                  <h4 class="promotion-title">Mac Pro</h4>
                  <div class="promotion-price">
                    <small>from</small> $1,299.00
                  </div>
                  <p class="promotion-desc">
                    Built for creativity on an epic scale.
                  </p>
                  <a href="#" class="promotion-btn">
                    View More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Promotion;
  