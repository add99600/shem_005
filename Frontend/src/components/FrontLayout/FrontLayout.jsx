import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./top-nav";
import Header from "./header";
import Footer from "./footer";
import HeaderData from "./header-data";
import useUserInfo from "../User/useUserInfo";

function FrontLayout() {
  useUserInfo();

  return (
    <div>
      <HeaderData />
      <TopNav />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default FrontLayout;
