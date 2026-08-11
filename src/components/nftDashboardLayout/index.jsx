"use client";
import React, { useState } from "react";
import Header from "./header";
import SideBar from "./sidebar";
import styles from "./dashbordLayout.module.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
const page = (props) => {
  const { children } = props;
  // const { loginReducer } = useSelector((res) => res);
  const [show, isShow] = useState(false);
  const handelSidebar = () => {
    isShow(!show);
  };
  // useEffect(() => {
  //   if (loginReducer?.isLogin) {
  //     axios.defaults.headers.common[
  //       "Authorization"
  //     ] = `Bearer ${loginReducer?.userDetail?.token}`;
  //   }
  // }, [loginReducer]);
  return (
    <div className={` ${styles.main_box}`}>
      <Header data={{ handelSidebar }} />
      <div className={`${styles.main}`}>
        <SideBar data={{ show }} />
        {children}
      </div>
    </div>
  );
};

export default page;
