"use client";
import React, { useState } from "react";
import Header from "./header";
import SideBar from "./sidebar";
import styles from "./dashbordLayout.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import { RefreshUser } from "@/redux/actions/loginAction";
import moment from "moment";

const page = (props) => {
  const { children } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const { loginReducer, landingRedirectReducers } = useSelector((res) => res);
  const [show, isShow] = useState(false);
  const handelSidebar = () => {
    isShow(!show);
  };
  useEffect(() => {
    if (loginReducer?.isLogin) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${loginReducer?.userDetail?.token}`;

      var oldTime = localStorage.getItem("current_time");
      if (oldTime != null) {
        var newTime = new Date();
        oldTime = moment(oldTime);
        newTime = moment(newTime);
        var check = newTime.diff(oldTime, "minutes");
        if (check > 30) {
          localStorage.setItem("current_time", new Date());
          dispatch(RefreshUser(loginReducer.userDetail.refreshToken));
        }
      } else {
        localStorage.setItem("current_time", new Date());
        dispatch(RefreshUser(loginReducer.userDetail.refreshToken));
      }
    }
    if (!loginReducer?.isLogin) {
      router.push("/login");
    }
  }, [loginReducer]);

  useEffect(() => {
    if (landingRedirectReducers?.isLocation) {
      dispatch({ type: "LAND_REDIRECT_FAILED" });
      router.push(landingRedirectReducers?.location);
    }
  }, [landingRedirectReducers]);

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
