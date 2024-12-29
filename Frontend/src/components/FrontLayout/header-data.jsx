import React, { useEffect, useState, useContext } from "react";
import { MenuContext } from "../../contexts/MenuContext.jsx";
import { DataContext } from "hanawebcore-frontend";

function HeaderData() {
  const { menu, setMenu } = useContext(MenuContext);
  const { responseData = [] } = useContext(DataContext) || {};

  useEffect(() => {
    // null 체크 후 부모 메뉴만 필터링
    const parentMenus = responseData?.filter((item) => item.DATA1 !== null);

    // DATA4 기준으로 정렬
    const sortedParentMenus = parentMenus?.sort((a, b) => a.DATA4 - b.DATA4);

    // DATA3에는 부모의 DATA2값이 있기 때문에 sortedParentMenus의 자식으로 추가
    sortedParentMenus?.forEach((item) => {
      const childMenus = responseData?.filter(
        (child) => child.DATA3 === item.DATA2
      );
      item.children = childMenus;
    });

    setMenu(sortedParentMenus);
  }, [responseData]);

  return <></>;
}

export default HeaderData;
