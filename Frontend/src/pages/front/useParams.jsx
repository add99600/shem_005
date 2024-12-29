import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";

const useParams = ({ pageData }) => {
  let params = {};
  const { user } = useContext(AuthContext);

  if (user) {
    // user 객체의 모든 key-value를 params에 전개
    params = { ...params, ...user };

    // 글 제목을 자동화
    const date = new Date();
    const formattedDate =
      String(date.getFullYear()).slice(-2) +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0");

    const boardTitles = {
      공구검사신청제목: `${user.NAME} 공구검사신청_${formattedDate}`,
    };

    params = { ...params, ...boardTitles };
  }

  // 활용법 미정
  if (pageData) {
    params = { ...params, ...pageData };
  }

  return params;
};

export default useParams;
