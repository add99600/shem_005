import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { apiCall } from "hanawebcore-frontend";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export default function useUserInfo() {
  const { setUser, user } = useContext(AuthContext);
  // 초기 상태를 false로 변경
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const token = Cookies.get("x_auth");

  useEffect(() => {
    const getUserInfo = async () => {
      // 토큰이 없으면 바로 실패 처리
      if (!token) {
        setIsLoading(false);
        setIsSuccess(false);
        setUser(null); // user 상태도 초기화
        return;
      }

      try {
        const userInfo = await apiCall({
          endpoint: `${process.env.REACT_APP_BACK_HOST}/api/user/info`,
          method: "post",
          payload: { token },
        });

        // 응답 데이터 검증 강화
        if (userInfo?.success && userInfo?.originalData?.data?.[0]) {
          const userData = userInfo.originalData.data[0];
          setUser(userData);

          // 새 토큰 처리 로직 개선
          const newToken = userInfo.originalData.newtoken;
          if (newToken && newToken !== "undefined") {
            Cookies.set("x_auth", newToken, {
              expires: 1,
              path: "/",
              secure: process.env.NODE_ENV === "production",
              sameSite: "Lax",
              domain: window.location.hostname, // 도메인 명시
            });
          }
          setIsSuccess(true);
        } else {
          throw new Error("Invalid user data received");
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setIsSuccess(false);
        setUser(null); // 에러 시 user 상태 초기화
        // 토큰 관련 에러면 토큰 제거
        Cookies.remove("x_auth", { path: "/" });
      } finally {
        setIsLoading(false);
      }
    };

    // 홈 페이지가 아닐 때만 사용자 정보 요청
    if (location.pathname !== "/") {
      getUserInfo();
    } else {
      setIsLoading(false);
      setIsSuccess(true); // 홈페이지는 항상 성공으로 처리
    }
  }, [setUser, token, location.pathname]);

  return { isSuccess, isLoading };
}
