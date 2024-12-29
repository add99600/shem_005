import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { MenuContext } from "../../contexts/MenuContext.jsx";
import { AuthContext } from "../../contexts/AuthContext.jsx";

function Header() {
  const { menu } = useContext(MenuContext);
  const { user } = useContext(AuthContext);

  return (
    <div id="header" class="header">
      <div class="container">
        <div class="header-container">
          <button
            type="button"
            class="navbar-toggle collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-collapse"
          >
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <div class="header-logo">
            <Link to="/she/home">
              <span class="brand-logo"></span>
              <span class="brand-text">
                <span>SHE</span>Portal
                <small>Hana Micron</small>
              </span>
            </Link>
          </div>
          <div class="header-nav">
            <div class="collapse navbar-collapse show" id="navbar-collapse">
              {menu && (
                <ul class="nav justify-content-center">
                  {menu.map((item) => {
                    if (item.DATA1 === "link") {
                      return (
                        <li>
                          <NavLink to={`${item.DATA5}`}>{item.DATA2}</NavLink>
                        </li>
                      );
                    } else if (item.DATA1 === "dropdown") {
                      return (
                        <li class="dropdown dropdown-hover">
                          <a href="#" data-bs-toggle="dropdown">
                            {item.DATA2}
                            <b class="caret"></b>
                            <span class="arrow top"></span>
                          </a>
                          <div class="dropdown-menu">
                            {item.children?.map((child) => {
                              return (
                                <Link to={`${child.DATA5}`} className="dropdown-item">{child.DATA2}</Link>
                              );
                            })}
                          </div>
                        </li>
                      );
                    } else if (item.DATA1 === "dropdown-full") {
                      return (
                        <li class="dropdown dropdown-full-width dropdown-hover">
                          <a href="#" data-bs-toggle="dropdown">
                            {item.DATA2}
                            <b class="caret"></b>
                            <span class="arrow top"></span>
                          </a>
                          <div class="dropdown-menu p-0">
                            <div class="dropdown-menu-container">
                              <div class="dropdown-menu-sidebar">
                                <h4 class="title">Menu By Categories</h4>
                                <ul class="dropdown-menu-list">
                                  {item.children?.map((child) => {
                                    return (
                                      <li>
                                        <Link to={`${child.DATA5}`}>
                                          {child.DATA2}
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                              <div class="dropdown-menu-content">
                                <h4 class="title">Shop By Popular Phone</h4>
                                <div class="row">
                                  <div class="col-lg-3">
                                    <ul class="dropdown-menu-list">
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          iPhone 7
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          iPhone 6s
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          iPhone 6
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          iPhone 5s
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          iPhone 5
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                  <div class="col-lg-3">
                                    <ul class="dropdown-menu-list">
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          Galaxy S7
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          Galaxy A9
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          Galaxy J3
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          Galaxy Note 5
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          Galaxy S7
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                  <div class="col-lg-3">
                                    <ul class="dropdown-menu-list">
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          Lumia 730
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          Lumia 735
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          Lumia 830
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          Lumia 820
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          Lumia Icon
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                  <div class="col-lg-3">
                                    <ul class="dropdown-menu-list">
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          Xperia X
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          Xperia Z5
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          Xperia M5
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          Xperia C5
                                        </a>
                                      </li>
                                      <li>
                                        <a href="product_detail.html">
                                          <i class="fa fa-fw fa-angle-right text-muted"></i>{" "}
                                          Xperia C4
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                <h4 class="title">Shop By Brand</h4>
                                <ul class="dropdown-brand-list mb-0">
                                  <li>
                                    <a href="product.html">
                                      <img
                                        src="../assets/img/brand/brand-apple.png"
                                        alt=""
                                      />
                                    </a>
                                  </li>
                                  <li>
                                    <a href="product.html">
                                      <img
                                        src="../assets/img/brand/brand-samsung.png"
                                        alt=""
                                      />
                                    </a>
                                  </li>
                                  <li>
                                    <a href="product.html">
                                      <img
                                        src="../assets/img/brand/brand-htc.png"
                                        alt=""
                                      />
                                    </a>
                                  </li>
                                  <li>
                                    <a href="product.html">
                                      <img
                                        src="../assets/img/brand/brand-microsoft.png"
                                        alt=""
                                      />
                                    </a>
                                  </li>
                                  <li>
                                    <a href="product.html">
                                      <img
                                        src="../assets/img/brand/brand-nokia.png"
                                        alt=""
                                      />
                                    </a>
                                  </li>
                                  <li>
                                    <a href="product.html">
                                      <img
                                        src="../assets/img/brand/brand-blackberry.png"
                                        alt=""
                                      />
                                    </a>
                                  </li>
                                  <li>
                                    <a href="product.html">
                                      <img
                                        src="../assets/img/brand/brand-sony.png"
                                        alt=""
                                      />
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    }
                  })}

                  <li class="dropdown dropdown-hover">
                    <a href="#" data-bs-toggle="dropdown">
                      <i class="fa fa-search search-btn"></i>
                      <span class="arrow top"></span>
                    </a>
                    <div class="dropdown-menu p-15px">
                      <form
                        action="search_results.html"
                        method="POST"
                        name="search_form"
                      >
                        <div class="input-group">
                          <input
                            type="text"
                            placeholder="Search"
                            class="form-control bg-light"
                          />
                          <button class="btn btn-dark" type="submit">
                            <i class="fa fa-search"></i>
                          </button>
                        </div>
                      </form>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div class="header-nav">
            <ul class="nav justify-content-end">
              <li class="dropdown dropdown-hover">
                <a href="#" class="header-cart" data-bs-toggle="dropdown">
                  <i class="fa fa-shopping-bag"></i>
                  <span class="total">2</span>
                  <span class="arrow top"></span>
                </a>
                <div class="dropdown-menu dropdown-menu-cart p-0">
                  <div class="cart-header">
                    <h4 class="cart-title">Shopping Bag (1) </h4>
                  </div>
                  <div class="cart-body">
                    <ul class="cart-item">
                      <li>
                        <div class="cart-item-image">
                          <img
                            src="../assets/img/product/product-ipad.jpg"
                            alt=""
                          />
                        </div>
                        <div class="cart-item-info">
                          <h4>iPad Pro Wi-Fi 128GB - Silver</h4>
                          <p class="price">$699.00</p>
                        </div>
                        <div class="cart-item-close">
                          <a
                            href="#"
                            data-bs-toggle="tooltip"
                            data-bs-title="Remove"
                          >
                            &times;
                          </a>
                        </div>
                      </li>
                      <li>
                        <div class="cart-item-image">
                          <img
                            src="../assets/img/product/product-imac.jpg"
                            alt=""
                          />
                        </div>
                        <div class="cart-item-info">
                          <h4>21.5-inch iMac</h4>
                          <p class="price">$1299.00</p>
                        </div>
                        <div class="cart-item-close">
                          <a
                            href="#"
                            data-bs-toggle="tooltip"
                            data-bs-title="Remove"
                          >
                            &times;
                          </a>
                        </div>
                      </li>
                      <li>
                        <div class="cart-item-image">
                          <img
                            src="../assets/img/product/product-iphone.png"
                            alt=""
                          />
                        </div>
                        <div class="cart-item-info">
                          <h4>iPhone 6s 16GB - Silver</h4>
                          <p class="price">$649.00</p>
                        </div>
                        <div class="cart-item-close">
                          <a
                            href="#"
                            data-bs-toggle="tooltip"
                            data-bs-title="Remove"
                          >
                            &times;
                          </a>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="cart-footer">
                    <div class="row gx-2">
                      <div class="col-6">
                        <a
                          href="checkout_cart.html"
                          class="btn btn-default btn-theme d-block"
                        >
                          View Cart
                        </a>
                      </div>
                      <div class="col-6">
                        <a
                          href="checkout_cart.html"
                          class="btn btn-dark btn-theme d-block"
                        >
                          Checkout
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="divider"></li>
              <li>
                {user && Object.keys(user).length > 0 ? (
                  <>
                    <Link to="/she/mypage">
                      <img
                        src="../assets/img/user/user-1.jpg"
                        class="user-img"
                        alt=""
                      />
                      <span class="d-none d-xl-inline">{`${user.NAME}님`}</span>
                    </Link>
                  </>
                ) : (
                  <Link to="/">Login / Register</Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
