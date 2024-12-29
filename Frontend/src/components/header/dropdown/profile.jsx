import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

function DropdownProfile() {
  const { user, token } = useContext(AuthContext);
  const userName = user ? user.NAME : "Guest";

  const handleLogout = () => {
    axios
      .post(process.env.REACT_APP_BACK_HOST + "/api/user/logout", { token })
      .then((response) => {
        if (response.data.success) {
          alert("로그아웃 되었습니다.");
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("서버 요청 실패:", error);
      });
  };

  return (
    <div className="navbar-item navbar-user dropdown">
      <a
        href="#/"
        className="navbar-link dropdown-toggle d-flex align-items-center"
        data-bs-toggle="dropdown"
      >
        <div className="image image-icon bg-gray-800 text-gray-600">
          <i className="fa fa-user"></i>
        </div>
        <span>
          <span className="d-none d-md-inline">
            {userName ? userName + "님" : "Guest"}
          </span>
          <b className="caret"></b>
        </span>
      </a>
      <div className="dropdown-menu dropdown-menu-end me-1">
        <a href="#/" className="dropdown-item">
          Edit Profile
        </a>
        <a href="#/" className="dropdown-item d-flex align-items-center">
          Inbox
          <span className="badge bg-danger rounded-pill ms-auto pb-4px">2</span>
        </a>
        <a href="#/" className="dropdown-item">
          Calendar
        </a>
        <a href="#/" className="dropdown-item">
          Settings
        </a>
        <div className="dropdown-divider"></div>
        <a onClick={handleLogout} className="dropdown-item">
          Log Out
        </a>
      </div>
    </div>
  );
}

export default DropdownProfile;
