"use client";
import React, { useEffect, useState } from "react";
import styles from "./dashbordLayout.module.css";
import Link from "next/link";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { UserLogout } from "@/redux/actions/loginAction";
import { useRouter } from "next/navigation";
import { aribaUrl, indusUrl } from "../../../environment";
import Chatbot from '../Chatbot/index'
const Header = (props) => {
  const { data } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const { loginReducer } = useSelector((res) => res);
  const [userName, setUserName] = useState("");
  // const handleLogOut = () => {
  //   Swal.fire({
  //     text: "Are you sure you won't be Logout?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Logout",
  //     cancelButtonText: "cancel",
  //     reverseButtons: true,
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       dispatch(UserLogout());
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       console.log("Cancelled");
  //     }
  //   });
  // };

  // useEffect(() => {
  //   if (!loginReducer?.isLogin) {
  //     localStorage.clear();
  //     router.push("/");
  //   }
  //   if (loginReducer.error !== null && !loginReducer?.isLogin) {
  //     if (loginReducer.error.status === 401) {
  //       localStorage.clear();
  //       router.push("/login");
  //     }
  //   }
  //   if (loginReducer?.isLogin) {
  //     const { userName } = loginReducer?.userDetail?.data;
  //     setUserName(userName);
  //   }
  // }, [loginReducer]);

  return (
    <>
      <nav className={`navbar ${styles.dashboard_nav}`}>
        <div className="container-fluid">
          <Link
            href="/nftmarketdashboard"
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
            <button
              className={`btn shadow-none  ${styles.cus_button_2}`}
              data-bs-toggle="modal"
              data-bs-target="#exampleModal3"
            >
              {" "}
              Decentrawood Map
              {/* <span className={`${styles.within_iconbtn}`}> */}{" "}
              <i className="bi bi-globe-central-south-asia"></i>
              {/* </span> */}
            </button>
            <button
              className={`btn shadow-none ${styles.cus_button}`}
              onClick={() => router.push("/login")}
            >
              Sign in {/* <span className={`${styles.within_iconbtn2}`}> */}
              <i className="bi bi-box-arrow-in-right"></i>
              {/* </span> */}
            </button>
          </div>
        </div>

        {/* decentrawood Map modal */}
        <div
          className="modal fade"
          id="exampleModal3"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel3"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className={`modal-content ${styles.map_content}`}>
              <div className="modal-header border-0">
                <h5 className="modal-title" id="exampleModalLabel"></h5>
                <button
                  type="button"
                  className={` ${styles.close_btn}`}
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-6 col-md-6 text-center">
                    <div className={` ${styles.map_img_box}`}>
                      <div className={` ${styles.map_img}`}>
                        <img
                          src="/assets/ariba.png"
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                      <button
                        className={` ${styles.map_btn}`}
                        data-bs-dismiss="modal"
                        onClick={() => window.open(aribaUrl, "_blank")}
                      >
                        Ariba zone
                      </button>
                    </div>
                  </div>
                  <div className="col-6 col-md-6 text-center">
                    <div className={` ${styles.map_img_box}`}>
                      <div className={` ${styles.map_img}`}>
                        <img
                          src="/assets/spiritual.png"
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                      <button
                        className={` ${styles.map_btn}`}
                        data-bs-dismiss="modal"
                        onClick={() => window.open(indusUrl, "_blank")}
                      >
                        Indus zone
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Chatbot/>
      </nav>
    </>
  );
};

export default Header;
