"use client";
import React, { useEffect, useState } from "react";
import styles from "./dashbordLayout.module.css";
import Link from "next/link";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { UserLogout } from "@/redux/actions/loginAction";
import { useRouter } from "next/navigation";
import Chatbot from '../Chatbot/index'

const Header = (props) => {
  const { data } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const { loginReducer } = useSelector((res) => res);
  const [userName, setUserName] = useState("");
  const handleLogOut = () => {
    Swal.fire({
      text: "Are you sure you won't be Logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(UserLogout());
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Cancelled");
      }
    });
  };

  useEffect(() => {
    if (!loginReducer?.isLogin) {
      localStorage.clear();
      router.push("/");
    }
    if (loginReducer.error !== null && !loginReducer?.isLogin) {
      if (loginReducer.error.status === 401) {
        localStorage.clear();
        router.push("/login");
      }
    }
    if (loginReducer?.isLogin) {
      const { userName } = loginReducer?.userDetail?.data;
      setUserName(userName);
    }
  }, [loginReducer]);

  return (
    <>
      <nav className={`navbar ${styles.dashboard_nav}`}>
        <div className="container-fluid">
          <Link
            href="/marketdashboard"
            className={`navbar-brand d-md-block d-none ${styles.dashboard_logo}`}
          >
            <img src="/assets/logo.png" alt="" />
          </Link>
          <button
            className={`btn  d-md-none d-block ${styles.menu_icon}`}
            onClick={data.handelSidebar}
          >
            <i className="bi bi-list"></i>
          </button>
          <div className={` ${styles.dashboard_box_icon}`}>
            <Link
              href={"/marketdashboard/cart"}
              className={`${styles.cart_icon_box}`}
            >
              <i className="bi bi-cart3"></i>
            </Link>
            <div className="dropdown">
              <a
                className={`nav-link dropdown-toggle text-white border-0 ${styles.dropdown_cus}`}
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className={`${styles.profile_icon_box}`}>
                  <i className="bi bi-person"></i>
                </span>
                <span className={` ${styles.userid}`}>{userName}</span>
              </a>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <Link
                    href="/marketdashboard/profile"
                    className="dropdown-item"
                  >
                    Profile
                  </Link>
                </li>
                {/* <li>
                  <a className="dropdown-item" href="#">
                    Transaction History
                  </a>
                </li> */}
                <li>
                  <a className="dropdown-item" onClick={(e) => handleLogOut(e)}>
                    Log Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Chatbot/>
      </nav>
    </>
  );
};

export default Header;
