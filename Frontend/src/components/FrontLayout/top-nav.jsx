import React from "react";
import { Link } from "react-router-dom";

function TopNav() {
  return (
    <div id="top-nav" class="top-nav">
      <div class="container">
        <div class="collapse navbar-collapse show">
          <ul class="nav navbar-nav">
            <li class="dropdown dropdown-hover">
              <a href="#" data-bs-toggle="dropdown">
                <img
                  src={`${process.env.REACT_APP_URL}/front-assets/assets/img/flag/flag-korean.svg`}
                  class="flag-img"
                  alt=""
                />{" "}
                Korean <b class="caret"></b>
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a href="#" class="dropdown-item">
                    <img
                      src={`${process.env.REACT_APP_URL}/front-assets/assets/img/flag/flag-korean.svg`}
                      class="flag-img"
                      alt=""
                    />{" "}
                    Korean
                  </a>
                </li>
                <li>
                  <a href="#" class="dropdown-item">
                    <img
                      src={`${process.env.REACT_APP_URL}/front-assets/assets/img/flag/flag-english.png`}
                      class="flag-img"
                      alt=""
                    />{" "}
                    English
                  </a>
                </li>
                <li>
                  <a href="#" class="dropdown-item">
                    <img
                      src={`${process.env.REACT_APP_URL}/front-assets/assets/img/flag/flag-vietnam.svg`}
                      class="flag-img"
                      alt=""
                    />{" "}
                    Vietnam
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-end">
            <li>
              <Link to="/home">Admin</Link>
            </li>
            <li>
              <a href="#">Our Forum</a>
            </li>
            <li>
              <a href="#">Newsletter</a>
            </li>
            <li>
              <a href="#">
                <i class="fab fa-facebook-f f-s-14"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i class="fab fa-twitter f-s-14"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i class="fab fa-instagram f-s-14"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i class="fab fa-dribbble f-s-14"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
