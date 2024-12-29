// AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogIn, setIsLogIn] = useState(true);
  const [user, setUser] = useState(null); // 사용자 정보 저장
  const [token, setToken] = useState(null); // 토큰 저장
  // 애플리케이션 로드 시 로그인 상태 불러오기
  useEffect(() => {
    const savedIsLogIn = localStorage.getItem("isLogIn");
    if (savedIsLogIn) {
      setIsLogIn(JSON.parse(savedIsLogIn));
    }
  }, []);

  // 로그인 상태 저장하기
  useEffect(() => {
    localStorage.setItem("isLogIn", JSON.stringify(isLogIn));
  }, [isLogIn]);

  return (
    <AuthContext.Provider
      value={{ isLogIn, setIsLogIn, user, setUser, token, setToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
