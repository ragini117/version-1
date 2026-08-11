import axios from "axios";
import styles from "./forgotDesign.module.css";
import { apiUrl } from "../../../environment";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const page = () => {
const [email, setemail] = useState("")
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
const handleForgotPassword = async (e) => {
  e.preventDefault()
  console.log(email)
  try {
    const payload = {
     "newPassword": email,
     "resetToken":token
    }
  const resp = await axios.post(`${apiUrl}/users/resetPassword`,payload)
  console.log(resp)
    alert('Password Updated Successfully')
  } catch (error) {
    console.log(error.response.data)
    alert(error.response.data)
  }
}

  return (
    <>
      <section className={`${styles.connect_bg}`}>
        <div className="container py-2">
          <div className="row align-items-center py-4">
            <div className="col-12 col-md-6 d-md-none d-block">
              <div className={` ${styles.register_img}`}>
                <img src="./assets/banner-avt.png" alt="" />
              </div>
            </div>
            <div className="col-md-6 col-12 mx-auto">
              <div className={` ${styles.loginmain_box}`}>
                <div className={`${styles.header_box}`}>
                  <h2>Reset Your Password</h2>
                </div>
                <form onSubmit={handleForgotPassword}>

                <div className={`${styles.ragister_main_box}`}>
                  <div className="row">
                    <div className="col-12 col-md-12">
                      <label
                        htmlFor="exampleInputEmail1"
                        className={`form-label ${styles.cus_label}`}
                        >
                        Enter New Password
                      </label>
                      <div className={`mb-3 ${styles.form_style}`}>
                        <input
                          type="text"
                          className={`form-control ${styles.cus_form}`}
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          value={email}
                          onChange={(e)=>setemail(e.target.value)}
                          required
                          />
                        <div
                          id="emailHelp"
                          className={`form-text ${styles.form_cus_textlbl}`}
                          >
                         Enter new password 
                        </div>
                      </div>{" "}
                    </div>

                    <div className="col-12">
                      <div className="text-center">
                        <button
                          type="submit"
                          className={`btn ${styles.cus_refrral_btn}`}
                          >
                          <i className="fa-solid fa-key mx-2"></i>
                          Set New Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                </form>
              </div>
            </div>
            <div className="col-12 col-md-6 d-md-block d-none text-center">
              <div className={` ${styles.register_img}`}>
                <img
                  src="./assets/banner-avt.png"
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
                  <a href="">Forgot Password</a>
                  <span>|</span>
                  <a href=""> Create Your Account</a>
                </div>
              </div>

              <div className={` ${styles.fotter_bottom2}`}>
                <p className="mb-0">Secured by Decentrawood</p>
              </div>
            </div>
          </div>
        </div> */}
      </section>
    </>
  );
};
export default page;
