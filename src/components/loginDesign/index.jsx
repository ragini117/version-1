import Link from "next/link";
import styles from "./loginDesign.module.css";
import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserLogin } from "@/redux/actions/loginAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";
const page = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { loginReducer } = useSelector((res) => res);
  const router = useRouter();
  const [showpass, setShowpass] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleOnchange = (key, value) => {
    setLoginData({
      ...loginData,
      [key]: value,
    });
  };
  const handleLoginData = (e) => {
    dispatch(UserLogin(loginData));
  };
  useEffect(() => {
    if (loginReducer?.isLogin) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${loginReducer?.userDetail?.token}`;

      localStorage.setItem("_auth_token", loginReducer?.userDetail?.token);
      localStorage.setItem(
        "_auth_refreshToken",
        loginReducer?.userDetail?.refreshToken
      );

      if (loginReducer?.userDetail?.status === "Ok") {
        const obj2 = loginReducer?.userDetail?.message;
        if (localStorage.getItem("loginCount") === null) {
          toast.success(obj2, {
            position: toast.POSITION.TOP_RIGHT,
          });
          localStorage.setItem("loginCount", 1);
          localStorage.setItem("LoginTime", new Date());
        }

        localStorage.setItem(
          "address",
          loginReducer?.userDetail?.data?.accountId
        );
        localStorage.setItem(
          "refferalAddress",
          loginReducer?.userDetail?.data?.refferedBy
        );
        router.push("/marketdashboard");
      } else {
        const obj3 = loginReducer?.userDetail?.error;
        toast.error(obj3, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  }, [loginReducer]);
  return (
    <>
      <section className={`${styles.connect_bg}`}>
        <div className="container py-2">
          <div className="row align-items-center py-4">
            <div className="col-12 col-md-6 d-md-none d-block">
              <div className={` ${styles.register_img}`}>
                <img src="./assets/own-world.png" alt="" />
              </div>
            </div>
            <div className="col-md-6 col-12 mx-auto">
              <div className={` ${styles.loginmain_box}`}>
                <div className={`${styles.header_box}`}>
                  <h2>Login to Your Account</h2>
                </div>
                <div className={`${styles.ragister_main_box}`}>
                  <div className="row">
                    <div className="col-12 col-md-12">
                      <label className={`form-label ${styles.cus_label}`}>
                        Username
                      </label>
                      <div className={`mb-3 ${styles.form_style}`}>
                        <input
                          type="text"
                          className={`form-control ${styles.cus_form}`}
                          value={loginData.email}
                          onChange={(e) =>
                            handleOnchange("email", e.target.value)
                          }
                          placeholder="Username or Email"
                        />
                      </div>{" "}
                    </div>

                    <div className="col-12">
                      <label className={`form-label ${styles.cus_label}`}>
                        Password
                      </label>
                      <div className={`${styles.form_style}`}>
                        <div className={` ${styles.form_btn_box}`}>
                          <input
                            type={!showpass ? "password" : "text"}
                            className={`form-control ${styles.cus_form}`}
                            placeholder="password"
                            value={loginData.password}
                            onChange={(e) =>
                              handleOnchange("password", e.target.value)
                            }
                          />
                          { showpass ? 
                          <i className="fa-solid fa-eye-slash" onClick={()=>setShowpass(!showpass)} />
                            :
                            <i className="fa-solid fa-eye" onClick={()=>setShowpass(!showpass)} />}
                        </div>

                        <div
                          id="emailHelp"
                          className={`form-text ${styles.form_cus_textlbl}`}
                        >
                          Use 8 or more characters with a mix of letters,
                          numbers & symbols
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="text-center">
                        <button
                          className={`btn ${styles.cus_refrral_btn}`}
                          onClick={() => handleLoginData()}
                        >
                          <i className="fa-solid fa-right-to-bracket mx-2"></i>
                          Login
                        </button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className={`${styles.forget_txt_main}`}>
                          <div className={`${styles.forget_txt_log}`}>
                            <Link href={"/forgot"}>Forgot Password?</Link>
                            <span>|</span>
                            <Link href={"/register"}> Create Your Account</Link>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-12">
                            <div className={` ${styles.line_box}`}>
                              <div className={`${styles.line}`}></div>
                              <p>or</p>
                              <div className={`${styles.line}`}></div>
                            </div>
                          </div>

                          <div className="col-12 text-center my-3">
                            <button
                              className={` ${styles.connect_btn}`}
                              onClick={() => router.push("/metawallet")}
                            >
                              <i className="fa-solid fa-wallet mx-2"></i>
                              Connect with a wallet
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 d-md-block d-none">
              <div className={` ${styles.register_img}`}>
                <img
                  src="./assets/own-world.png"
                  className="img-fluid"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        {/* bottom footer wallet */}

        {/* <div className="container-fluid my-2">
          <div className="row">
            <div className="col-12">
              <div className={`${styles.fotter_bottom}`}>
                <div className={`${styles.link_loginbtm}`}>
                  <a href="">Forget Password</a>
                  <span>|</span>
                  <a href=""> Create Your Account</a>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <ToastContainer />
      </section>
    </>
  );
};
export default page;
