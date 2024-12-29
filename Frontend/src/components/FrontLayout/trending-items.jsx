function TrendingItems() {
  return (
    <div id="trending-items" class="section-container">
      <div class="container">
        <h4 class="section-title clearfix">
          <span class="flex-1">
            Trending Items
            <small>Shop and get your favourite items at amazing prices!</small>
          </span>
          <div class="btn-group">
            <a href="#" class="btn">
              <i class="fa fa-angle-left fs-16px"></i>
            </a>
            <a href="#" class="btn">
              <i class="fa fa-angle-right fs-16px"></i>
            </a>
          </div>
        </h4>
        <div class="row gx-2">
          <div class="col-lg-2 col-md-4 col-sm-6">
            <div class="item item-thumbnail">
              <a href="product_detail.html" class="item-image">
                <img src="../assets/img/product/product-iphone.png" alt="" />
                <div class="discount">15% OFF</div>
              </a>
              <div class="item-info">
                <h4 class="item-title">
                  <a href="product_detail.html">
                    iPhone 6s Plus
                    <br />
                    16GB
                  </a>
                </h4>
                <p class="item-desc">3D Touch. 12MP photos. 4K video.</p>
                <div class="item-price">$649.00</div>
                <div class="item-discount-price">$739.00</div>
              </div>
            </div>
          </div>
          <div class="col-lg-2 col-md-4 col-sm-6">
            <div class="item item-thumbnail">
              <a href="product_detail.html" class="item-image">
                <img src="../assets/img/product/product-ipad-pro.png" alt="" />
                <div class="discount">32% OFF</div>
              </a>
              <div class="item-info">
                <h4 class="item-title">
                  <a href="product.html">
                    9.7-inch iPad Pro
                    <br />
                    32GB
                  </a>
                </h4>
                <p class="item-desc">Super. Computer. Now in two sizes.</p>
                <div class="item-price">$599.00</div>
                <div class="item-discount-price">$799.00</div>
              </div>
            </div>
          </div>
          <div class="col-lg-2 col-md-4 col-sm-6">
            <div class="item item-thumbnail">
              <a href="product_detail.html" class="item-image">
                <img src="../assets/img/product/product-imac.png" alt="" />
                <div class="discount">20% OFF</div>
              </a>
              <div class="item-info">
                <h4 class="item-title">
                  <a href="product.html">
                    21.5-inch iMac
                    <br />
                    with Retina Display
                  </a>
                </h4>
                <p class="item-desc">Retina. Now in colossal and ginormous.</p>
                <div class="item-price">$1,099.00</div>
                <div class="item-discount-price">$1,299.00</div>
              </div>
            </div>
          </div>
          <div class="col-lg-2 col-md-4 col-sm-6">
            <div class="item item-thumbnail">
              <a href="product_detail.html" class="item-image">
                <img
                  src="../assets/img/product/product-apple-watch.png"
                  alt=""
                />
                <div class="discount">13% OFF</div>
              </a>
              <div class="item-info">
                <h4 class="item-title">
                  <a href="product.html">
                    Apple Watch
                    <br />
                    Stainless steel cases
                  </a>
                </h4>
                <p class="item-desc">You. At a glance.</p>
                <div class="item-price">$599.00</div>
                <div class="item-discount-price">$799.00</div>
              </div>
            </div>
          </div>
          <div class="col-lg-2 col-md-4 col-sm-6">
            <div class="item item-thumbnail">
              <a href="product_detail.html" class="item-image">
                <img
                  src="../assets/img/product/product-macbook-pro.png"
                  alt=""
                />
                <div class="discount">30% OFF</div>
              </a>
              <div class="item-info">
                <h4 class="item-title">
                  <a href="product.html">
                    MacBook Pro
                    <br />
                    with Retina Display
                  </a>
                </h4>
                <p class="item-desc">Stunning Retina Display</p>
                <div class="item-price">$1299.00</div>
                <div class="item-discount-price">$1499.00</div>
              </div>
            </div>
          </div>
          <div class="col-lg-2 col-md-4 col-sm-6">
            <div class="item item-thumbnail">
              <a href="product_detail.html" class="item-image">
                <img src="../assets/img/product/product-apple-tv.png" alt="" />
                <div class="discount">40% OFF</div>
              </a>
              <div class="item-info">
                <h4 class="item-title">
                  <a href="product.html">
                    Apple Tv
                    <br />
                    32GB
                  </a>
                </h4>
                <p class="item-desc">The future of television is here.</p>
                <div class="item-price">$149.00</div>
                <div class="item-discount-price">$249.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrendingItems;
