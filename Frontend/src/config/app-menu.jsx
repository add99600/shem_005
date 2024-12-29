const Menu = [
  { path: "/home", icon: "fa fa-sitemap", title: "Home" },
  {
    path: "/sqlmanage",
    icon: "fa fa-shapes",
    title: "조회 SQL관리",
    label: "NEW",
    children: [
      { path: "/sql-manage", title: "조회 SQL 관리" },
      { path: "/model-manage", title: "조회 모델 관리" },
      { path: "/menu-manage", title: "조회 메뉴 관리" },
      { path: "/setting-manage", title: "조회 json 세팅 관리" },
    ],
  },
  {
    path: "/sqlupdate",
    icon: "fa fa-shapes",
    title: "등록 SQL관리",
    children: [
      { path: "/sql-update", title: "등록 SQL 관리" },
      { path: "/menu-update", title: "등록 메뉴 관리" },
      { path: "/update-setting-manage", title: "등록 json 세팅 관리" },
    ],
  },
  {
    path: "/htmlmanage",
    icon: "fa fa-city",
    title: "템플릿관리",
    label: "NEW",
    children: [
      { path: "/makegrapesjs", title: "템플릿 생성" },
      { path: "/html-manage", title: "HTML / CSS 관리" },
    ],
  },
  // {
  //   path: "/menu",
  //   icon: "fa fa-shapes",
  //   title: "메뉴관리",
  //   label: "NEW",
  //   children: [
  //     { path: "/menu-create", title: "메뉴생성" },
  //     { path: "/menu-manage", title: "메뉴수정" },
  //   ],
  // },
  {
    path: "/code",
    icon: "fa fa-dice-five",
    title: "기준정보관리",
    label: "NEW",
    children: [
      { path: "/code-str-manage", title: "문자열코드관리" },
      { path: "/code-json-manage", title: "코드JSON관리" },
      { path: "/code-file-manage", title: "파일코드관리" },
      // { path: "/code-make", title: "문자열코드생성" },
      { path: "/erp-table", title: "관리감독" },
      { path: "/manage-check-list", title: "관리감독자 체크리스트" },
    ],
  },
  {
    path: "/gcm",
    icon: "fa fa-city",
    title: "테이블관리",
    children: [
      { path: "/table-manage", title: "테이블통합관리" },
      // { path: "/gcm-data-manage", title: "GCM데이터관리" },
      // { path: "/gcm-code-manage", title: "코드관리" },
      // { path: "/gcm-code-data-manage", title: "코드데이터관리" },
      // { path: "/gcm-column-manage", title: "컬럼관리" },
      // { path: "/gcm-column-data-manage", title: "컬럼이름관리" },
    ],
  },
  // { path: "/dept", icon: "fa fa-city", title: "부서관리" },
  // { path: "/insert_menu", icon: "fa fa-city", title: "메뉴명등록" },
  // { path: "/system", icon: "fa fa-cogs", title: "시스템관리" },
  // { path: "/layout", icon: "fa fa-cogs", title: "화면생성" },
  // { path: "/layout2", icon: "fa fa-cogs", title: "화면생성2" },
  // { path: "/layout3", icon: "fa fa-cogs", title: "화면생성3" },
  // { path: "/layout4", icon: "fa fa-cogs", title: "화면생성4" },
  // { path: "/layout5", icon: "fa fa-cogs", title: "html생성" },
  // {
  //   path: "/mail",
  //   icon: "fa fa-envelope",
  //   title: "메일관리",
  //   label: "NEW",
  //   children: [
  //     { path: "/mail-test", title: "메일템플릿저장테스트" },
  //     { path: "/mail-test2", title: "메일템플릿적용테스트" },
  //   ],
  // },
  {
    path: "/front-menu-manage",
    icon: "fa fa-list",
    title: "메뉴 및 Role 관리",
    children: [{ path: "/site-menu-manage", title: "메뉴 및 Role 관리" }],
  },
  {
    path: "/excel-uplaod",
    icon: "fa fa-city",
    title: "엑셀 업로드",
    children: [{ path: "/excel-upload", title: "엑셀 업로드" }],
  },
  {
    path: "/api-manage",
    icon: "fa fa-city",
    title: "API 관리",
    children: [{ path: "/api-manage", title: "API 관리" }],
  },

  /*
  { path: '/menu', icon: 'fa fa-align-left', title: 'Menu Level',
    children: [
      { path: '/menu/menu-1-1', title: 'Menu 1.1',
        children: [
          { path: '/menu/menu-1-1/menu-2-1', title: 'Menu 2.1',
            children: [
              { path: '/menu/menu-1-1/menu-2-1/menu-3-1', title: 'Menu 3.1' },
              { path: '/menu/menu-1-1/menu-2-1/menu-3-2', title: 'Menu 3.2' }
            ]
          },
          { path: '/menu/menu-1-1/menu-2-2', title: 'Menu 2.2' },
          { path: '/menu/menu-1-1/menu-2-3', title: 'Menu 2.3' },
        ]
      },
      { path: '/menu/menu-1-2', title: 'Menu 1.2' },
      { path: '/menu/menu-1-3', title: 'Menu 1.3' },
    ]
  }
  */
];

export default Menu;
