import React from "react";
import FrontLayout from "../components/FrontLayout/FrontLayout";

import Home from "../pages/front/home";
import MyPage from "../pages/User/mypage";

import PageHub from "../pages/front/PageHub";

import RegistHub from "../pages/front/regist/regist-hub";
import UpdateHub from "../pages/front/update/update-hub";

import RiskBoard from "../pages/front/risk_board/RiskBoard";
import ExtraSettingsPage from "../pages/extra/extra-settings-page";

/**
 * 프론트 라우터에서 key 값을 넣어줘야 페이지 이동 시 페이지 초기화가 된다.
 * React Router가 페이지 이동 시 같은 컴포넌트를 재사용하려 하는데, 이때 key 값이 다르면 새로운 컴포넌트를 생성한다.
 */

const FrontRoute = [
  {
    path: "she",
    element: <FrontLayout />,
    children: [
      { path: "home", element: <Home /> },
      { path: "mypage", element: <MyPage /> },

      // 안전작업신고
      {
        path: "safety/work",
        element: (
          <PageHub key="shem005" menuId="shem005" title="안전작업신고" />
        ),
      },
      {
        path: "safety/work/regist",
        element: (
          <RegistHub key="shem005" menuId="shem005" title="안전작업신고등록" />
        ),
      },
      {
        path: "safety/work/update/:table/:id",
        element: (
          <UpdateHub key="shem005" menuId="shem005" title="안전작업신고수정" />
        ),
      },

      // 공구검사신고
      {
        path: "safety/tool",
        element: (
          <PageHub key="shem007" menuId="shem007" title="공구검사신고" />
        ),
      },
      {
        path: "safety/tool/regist",
        element: (
          <RegistHub key="shem007" menuId="shem007" title="공구검사신고등록" />
        ),
      },
      {
        path: "safety/tool/update/:table/:id",
        element: (
          <UpdateHub key="shem007" menuId="shem007" title="공구검사신고수정" />
        ),
      },

      // 관리감독자 점검표
      {
        path: "safety/checklist",
        element: (
          <PageHub key="shem014" menuId="shem014" title="관리감독자 점검표" />
        ),
      },
      {
        path: "safety/checklist/regist",
        element: (
          <RegistHub
            key="shem014"
            menuId="shem014"
            title="관리감독자 점검표 등록"
          />
        ),
      },
      {
        path: "safety/checklist/update/:table/:id",
        element: (
          <UpdateHub
            key="shem014"
            menuId="shem014"
            title="관리감독자 점검표 수정"
          />
        ),
      },

      // 일일TBM일지
      {
        path: "safety/tbm",
        element: <PageHub key="shem018" menuId="shem018" title="일일TBM일지" />,
      },
      {
        path: "safety/tbm/regist",
        element: (
          <RegistHub key="shem018" menuId="shem018" title="일일TBM일지 등록" />
        ),
      },
      {
        path: "safety/tbm/update/:table/:id",
        element: (
          <UpdateHub key="shem018" menuId="shem018" title="일일TBM일지 수정" />
        ),
      },

      // 작업절차 및 메뉴얼
      {
        path: "safety/menual",
        element: (
          <PageHub key="shem011" menuId="shem011" title="작업절차 및 메뉴얼" />
        ),
      },
      {
        path: "safety/menual/regist",
        element: (
          <RegistHub
            key="shem011"
            menuId="shem011"
            title="작업절차 및 메뉴얼 등록"
          />
        ),
      },

      // 화학물질 사용신고
      {
        path: "safety/chemical",
        element: (
          <PageHub key="shem002" menuId="shem002" title="화학물질 사용신고" />
        ),
      },
      {
        path: "safety/chemical/regist",
        element: (
          <RegistHub
            key="shem002"
            menuId="shem002"
            title="화학물질 사용신고 등록"
          />
        ),
      },
      {
        path: "safety/chemical/update/:table/:id",
        element: (
          <UpdateHub
            key="shem002"
            menuId="shem002"
            title="화학물질 사용신고 수정"
          />
        ),
      },

      // 자체점검대장
      {
        path: "safety/inspect",
        element: (
          <PageHub key="shem020" menuId="shem020" title="자체점검대장" />
        ),
      },
      {
        path: "safety/inspect/regist",
        element: (
          <RegistHub key="shem020" menuId="shem020" title="자체점검대장 등록" />
        ),
      },
      {
        path: "safety/inspect/update/:table/:id",
        element: (
          <UpdateHub key="shem020" menuId="shem020" title="자체점검대장 수정" />
        ),
      },

      // 물질안전보건자료
      {
        path: "safety/health",
        element: (
          <PageHub key="shem003" menuId="shem003" title="물질안전보건자료" />
        ),
      },
      {
        path: "safety/health/regist",
        element: (
          <RegistHub
            key="shem003"
            menuId="shem003"
            title="물질안전보건자료 등록"
          />
        ),
      },
      {
        path: "safety/health/update/:table/:id",
        element: (
          <UpdateHub
            key="shem003"
            menuId="shem003"
            title="물질안전보건자료 수정"
          />
        ),
      },

      // 종사자 의견청취
      {
        path: "safety/option",
        element: (
          <PageHub key="shem016" menuId="shem016" title="종사자 의견청취" />
        ),
      },
      {
        path: "safety/option/regist",
        element: (
          <RegistHub
            key="shem016"
            menuId="shem016"
            title="종사자 의견청취 등록"
          />
        ),
      },
      {
        path: "safety/option/update/:table/:id",
        element: (
          <UpdateHub
            key="shem016"
            menuId="shem016"
            title="종사자 의견청취 수정"
          />
        ),
      },

      // 공지사항
      {
        path: "safety/notification",
        element: (
          <PageHub key="she_notice" menuId="she_notice" title="공지사항" />
        ),
      },
      {
        path: "safety/notification/regist",
        element: (
          <RegistHub
            key="she_notice"
            menuId="she_notice"
            title="공지사항 등록"
          />
        ),
      },
      {
        path: "safety/notification/update/:table/:id",
        element: (
          <UpdateHub
            key="she_notice"
            menuId="she_notice"
            title="공지사항 수정"
          />
        ),
      },
      // 위험성평가
      {
        path: "safety/risk",
        element: <RiskBoard />,
      },

      // 자료실
      {
        path: "safety/dataroom",
        element: (
          <PageHub key="she_reference" menuId="she_reference" title="자료실" />
        ),
      },
      {
        path: "safety/dataroom/regist",
        element: (
          <RegistHub
            key="she_reference"
            menuId="she_reference"
            title="자료실 등록"
          />
        ),
      },
      {
        path: "safety/dataroom/update/:table/:id",
        element: (
          <UpdateHub
            key="she_reference"
            menuId="she_reference"
            title="자료실 수정"
          />
        ),
      },
    ],
  },
];

export default FrontRoute;
