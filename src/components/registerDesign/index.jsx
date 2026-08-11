import { useRouter, useSearchParams } from "next/navigation";
import styles from "./registerDesign.module.css";
import { useFormik } from "formik";
import { apiUrl } from "../../../environment";
import axios from "axios";
import { SignupSchema } from "./SignupSchema";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Swal from "sweetalert2";
import Loader from "../../components/loaderDesign/index";

const page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const referalAddress = searchParams.get("referalAddress");
  const [loading, setLoading] = useState(false);
  const [showpass, setShowpass] = useState(false)
  // console.log("referalAddress**", referalAddress);
  const accountAddress = localStorage.getItem("address");
  const initialValues = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    refferedby: "",
  };
  const start_and_end = (address) => {
    if (address !== undefined) {
      return (
        address.substr(0, 10) +
        "...." +
        address.substr(address.length - 10, address.length)
      );
    }
    return address;
  };
  const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
    useFormik({
      initialValues,
      onSubmit: (value) => {
        try {
          const data = {
            accountId: accountAddress ? accountAddress : null,
            cPassword: value.confirmPassword,
            email: value.email,
            password: value.password,
            refferedBy:
              referalAddress && referalAddress !== "" ? referalAddress : null,
            username: value.userName,
          };
          console.log("register", data);
          handleRegistraton(data);
        } catch (error) {
          console.log(error)
          alert(error.response.data)
        }
      },
    });
  const handleRegistraton = async (data) => {
    try {
      // if (data.accountId == null) {
      //   alert('Account Address is a required field , try with metamask')
      // } else {
      setLoading(true);
      const api = `${apiUrl}${"/users/dwoodUserRegistration"}`;
      const checkemail = `${apiUrl}${"/users/emailValidation"}`;
      const checkvalidmail = await axios.post(checkemail, { email: data.email })
      if (checkvalidmail.data.error) {
        return alert('Email already registered , Please use another email iD')
      }

      const checkusername = `${apiUrl}${"/users/usernameValidation"}`;
      const checkvalidusername = await axios.post(checkusername, { username: data.username })
      // console.log(checkvalidusername)
      if (checkvalidusername.data.error) {
        return alert('username already registered , Please use another username')
      }
      const res = await axios.post(api, data)
      if (res.status === 200) {
        // Swal.fire({
        //   title: "Registered Successfully!",
        //   text: " Please Log In ",
        //   icon: "success",
        //   // showCancelButton: true,
        //   confirmButtonText: "Login",
        //   // cancelButtonText: "cancel",
        //   reverseButtons: true,
        // }).then(async (result) => {
        //   if (result.isConfirmed) {
        //     router.push("/login");
        //   }
        // });
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "registration_success",
          email: data.email, // optional (remove if privacy concern)
        });
        router.push(`/register/ThankYou?email=${data.email}`);

        // toast.success("Registered Successfully! Please Log In ");
        // // setShow(true);
        // setTimeout(() => {
        //   router.push("/LoginPage")
        // }, 500);
        // } 
      }
    } catch (error) {
      console.log(error)
      alert("error", error.response.data);
    }
    setLoading(false);
  };
  return (
    <>
      {loading && <Loader />}
      <section className={`${styles.connect_bg}`}>
        <div className="container py-2">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 d-md-none d-block ">
              <div className={` ${styles.register_img}`}>
                <img src="./assets/AVTAR.png" className="img-fluid" alt="" />
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className={`${styles.header_box}`}>
                <h2>Register</h2>
              </div>
              <div className={`${styles.ragister_main_box}`}>
                <div className="row">
                  <form onSubmit={handleSubmit}>
                    <div className="col-12 col-md-12">
                      <div className="mb-3">
                        <label className={`form-label ${styles.cus_label}`}>
                          Username
                        </label>
                        <input
                          type="text"
                          className={`form-control ${styles.cus_form}`}
                          placeholder="username"
                          name="userName"
                          value={values.userName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.userName && touched.userName ? (
                          <div className={`${styles.errorStyle}`}>
                            {errors.userName}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-12 col-md-12">
                      <div className="mb-3">
                        <label className={`form-label ${styles.cus_label}`}>
                          Email
                        </label>
                        <input
                          type="email"
                          className={`form-control ${styles.cus_form}`}
                          placeholder="Email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.email && touched.email ? (
                          <div className={`${styles.errorStyle}`}>
                            {errors.email}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="mb-3">
                        <label className={`form-label ${styles.cus_label}`}>
                          Password
                        </label>
                        <div className={`position-relative`}>


                          <input
                            type={!showpass ? "password" : "text"}
                            className={`form-control ${styles.cus_form}`}
                            placeholder="Password"
                            name="password"
                            value={values.password}
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {showpass ?
                            <i className="fa-solid fa-eye-slash" style={{ position: 'absolute', right: '20px', top: '6px', color: 'white' }} onClick={() => setShowpass(!showpass)} />
                            :
                            <i className="fa-solid fa-eye" style={{ position: 'absolute', right: '20px', top: '6px', color: 'white' }} onClick={() => setShowpass(!showpass)} />}
                        </div>
                        {errors.password && touched.password ? (
                          <div className={`${styles.errorStyle}`}>
                            {errors.password}
                          </div>
                        ) : null}
                        <div className={`form-text ${styles.form_cus_textlbl}`}>
                          Use 8 or more characters with a mix of letters,
                          numbers & symbols
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="mb-3">
                        <label className={`form-label ${styles.cus_label}`}>
                          Confirm password
                        </label>
                        <div className={`position-relative`}>
                          <input
                            type={!showpass ? "password" : "text"}
                            className={`form-control ${styles.cus_form}`}
                            placeholder="confirm Password"
                            name="confirmPassword"
                            value={values.confirmPassword}
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {showpass ?
                            <i className="fa-solid fa-eye-slash" style={{ position: 'absolute', right: '20px', top: '6px', color: 'white' }} onClick={() => setShowpass(!showpass)} />
                            :
                            <i className="fa-solid fa-eye" style={{ position: 'absolute', right: '20px', top: '6px', color: 'white' }} onClick={() => setShowpass(!showpass)} />}
                        </div>
                        {errors.confirmPassword && touched.confirmPassword ? (
                          <div className={`${styles.errorStyle}`}>
                            {errors.confirmPassword}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    {referalAddress && referalAddress !== "" ? (
                      <div className="col-12">
                        <div className="mb-3">
                          <label className={`form-label ${styles.cus_label}`}>
                            Referral Wallet{" "}
                          </label>
                          <input
                            type="text"
                            className={`form-control ${styles.cus_form}`}
                            placeholder="Referral Wallet"
                            name="refferedby"
                            value={referalAddress}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled
                          />
                          {errors.refferedby && touched.refferedby ? (
                            <div className={`${styles.errorStyle}`}>
                              {errors.refferedby}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    <div className="col-12">
                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          className={`form-check-input ${styles.cus_form_check}`}
                          id="exampleCheck1"
                        />
                        <label
                          className={`form-label ${styles.cus_label_check}`}
                        >
                          By creating an account, you agree to our Terms of use
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="text-center">
                        <button
                          type="submit"
                          className={`btn ${styles.cus_refrral_btn}`}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                  {
                    accountAddress && <span className="text-white mt-3">Connected Account : {start_and_end(accountAddress)}</span>
                  }
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 d-md-block d-none">
              <div className={` ${styles.register_img}`}>
                <img src="./assets/AVTAR.png" alt="" />
              </div>
            </div>
          </div>
        </div>

        {/* bottom footer wallet */}

        {/* <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className={`${styles.fotter_bottom}`}>
                                <p> Already have an account?
                                    <a href=""> Login?</a></p>
                            </div>

              <div className={` ${styles.fotter_bottom2}`}>
                <p>Secured by Decentrawood</p>
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
