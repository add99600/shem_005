import React, { useEffect, useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AppSettings } from "../../config/app-settings.js";
import { apiCall } from "hanawebcore-frontend";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import Cookies from "js-cookie";

function LoginV1() {
  const navigate = useNavigate();

  const context = useContext(AppSettings);
  const { setUser } = useContext(AuthContext);
  const [redirect, setRedirect] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("클립보드에 복사되었습니다.");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    context.handleSetAppHeaderNone(true);
    context.handleSetAppSidebarNone(true);
    context.handleSetAppContentClass("p-0");

    return function cleanUp() {
      context.handleSetAppHeaderNone(false);
      context.handleSetAppSidebarNone(false);
      context.handleSetAppContentClass("");
    };

    // eslint-disable-next-line
  }, []);

  function handleSubmit(event) {
    // 초기비밀번호: 81dc9bdb52d04dc20036dbd8313ed055
    event.preventDefault();

    const getLogin = async () => {
      try {
        const result = await apiCall({
          endpoint: `${process.env.REACT_APP_BACK_HOST}/api/user/login`,
          method: "post",
          payload: {
            id: id,
            password: password,
          },
        });

        if (result && result.success) {
          // 토큰 저장을 쿠키로 설정
          Cookies.set("x_auth", result.originalData.accesstoken);

          console.log("result", result);

          // 사용자 정보 호출
          const userInfo = await apiCall({
            endpoint: `${process.env.REACT_APP_BACK_HOST}/api/user/info`,
            method: "post",
            payload: { token: result.originalData.accesstoken },
          });

          setUser(userInfo.originalData.data[0]);
          navigate("/she/home");
        } else {
          alert("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    };

    getLogin();
  }

  return (
    <div className="login login-v1">
      <div className="login-container">
        <div className="login-header">
          <div className="brand">
            <div className="d-flex align-items-center">
              <span className="logo"></span> <b>Color</b> Admin
            </div>
            <small>Bootstrap 5 Responsive Admin Template</small>
          </div>
          <div className="icon">
            <i className="fa fa-lock"></i>
          </div>
        </div>
        <div className="login-body">
          <div className="login-content fs-13px">
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-20px">
                <input
                  type="text"
                  className="form-control fs-13px h-45px"
                  id="emailAddress"
                  placeholder="Email Address"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
                <label
                  htmlFor="emailAddress"
                  className="d-flex align-items-center py-0"
                >
                  ID
                </label>
              </div>
              <div className="form-floating mb-20px">
                <input
                  type="password"
                  className="form-control fs-13px h-45px"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor="password"
                  className="d-flex align-items-center py-0"
                >
                  Password
                </label>
              </div>
              <div className="form-check mb-20px">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="rememberMe"
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Remember Me
                </label>
              </div>
              <div className="login-buttons">
                <button
                  type="submit"
                  className="btn h-45px btn-theme d-block w-100 btn-lg"
                >
                  Login
                </button>
              </div>
            </form>
            <div className="d-flex align-items-center mt-3">
              <span>81dc9bdb52d04dc20036dbd8313ed055</span>
              <button
                onClick={() => handleCopy("81dc9bdb52d04dc20036dbd8313ed055")}
                className="btn btn-sm btn-outline-secondary ms-10px"
              >
                복사
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginV1;
