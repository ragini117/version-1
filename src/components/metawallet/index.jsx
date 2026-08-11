import Link from "next/link";
import styles from "./metawallet.module.css";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserLoginWithWallet } from "@/redux/actions/loginWithWalletAction";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { apiUrl } from "../../../environment";
import { switchNetworks } from "@/utils/switchNetwork";
const page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lodding, setLoadding] = useState(false);
  const [address, setAddress] = useState("");
  const [referalAddress, setReferalAddress] = useState("");
  const { loginReducer } = useSelector((res) => res);

  const referral = searchParams.get("referral");
  const verify = searchParams.get("verify");
  console.log("referalAddress**", referalAddress);
  async function handleMetamask(e) {
    setLoadding(true);


    try {
      let provider;
      if (window.ethereum) {
        provider = window.ethereum;
      } else if (window.web3) {
        provider = window.web3.currentProvider;
      } else {
        window.alert("No ethereum browser !checkout metamask");
      }
      if (provider) {
        if (provider !== window.ethereum) {
          console.error(
            "Not window.ethereum.Do you have multiple wallets installed"
          );
        }
        await provider.request({
          method: "eth_requestAccounts",
        });
      }
      switchNetworks("bsc")
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = newProvider.getSigner();

      const message = [
        "Welcome to the Decentrawood Dashboard!",
        "Please sign this message to verify your identity.",
        "Please sign me in!",
      ].join("\n\n");
      let signature = await signer.signMessage(message);
      const currentaccount = await signer.getAddress();
      const address = currentaccount.toLowerCase();
      localStorage.setItem("address", address);
      await handleIsRegister(address);
    } catch (error) {
      console.log("wallet loagin Error", error);
    }
    setLoadding(false);
  }

  const handleIsRegister = async (addressID) => {
    setAddress(addressID);
    dispatch(UserLoginWithWallet(addressID));
  };
  const handleRegister = async () => {
    localStorage.removeItem("address");
   const redirectLink = referalAddress !== "" ?`/register?referalAddress=${referalAddress?.toString()}`:"/register"
    router.push(redirectLink)
  }
  useEffect(() => {
    const handleIsRegisterApi = async () => {
      try {
        if (referral !== undefined && referral !== null) {
          const api = `${apiUrl}${`/users/verifyRefferalUser?accountId=${referral}`}`;
          const res = await axios.get(api);
          if (res?.data?.status === "Ok") {
            setReferalAddress(referral);
            toast.success("Referral Added!", {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else {
            setReferalAddress("");
            toast.error(
              `${"Invalid Referral! Please enter a proper refferal id ."}`,
              {
                position: toast.POSITION.TOP_RIGHT,
              }
            );
          }
        }
      } catch (error) {
        console.log("registerIsValiderror", error);
      }
    };
    handleIsRegisterApi();
  }, [referral]);

  useEffect(() => {
    if (loginReducer.isLogin) {
      if (
        loginReducer?.userDetail &&
        loginReducer?.userDetail.message &&
        loginReducer?.userDetail.is_registered
      ) {
        localStorage.setItem("address", loginReducer.userDetail.data.accountId);
        localStorage.setItem(
          "refferalAddress",
          loginReducer.userDetail.data.refferedBy
        );
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${loginReducer.userDetail.token}`;
        localStorage.setItem("LoginTime", new Date());
        localStorage.setItem("_auth_token", loginReducer?.userDetail?.token);
        localStorage.setItem(
          "_auth_refreshToken",
          loginReducer?.userDetail?.refreshToken
        );
        router.push("/marketdashboard");
      }
    } else {
      if (loginReducer.userDetail && loginReducer.userDetail.is_registered) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${loginReducer.userDetail.token}`;
        localStorage.setItem("_auth_token", loginReducer?.userDetail?.token);
        localStorage.setItem(
          "_auth_refreshToken",
          loginReducer?.userDetail?.refreshToken
        );
        router.push("/marketdashboard");
      }
      if (
        loginReducer.userDetail.is_registered !== null &&
        !loginReducer.userDetail.is_registered
      ) {
        dispatch({ type: "LOGIN_RESET" });
        localStorage.setItem("address", address);
        {
          referalAddress !== ""
            ? router.push(
                `${"/register"}?referalAddress=${referalAddress?.toString()}`
              )
            : router.push("/register");
        }

        // alert("User Wallet unregistered ! Please register or login with email")
      }
    }
  }, [loginReducer]);

  useEffect(() => {
    
    if (verify=="true") {
      alert("Email verified Successfully , Please Login")
    }

  }, [verify])
  
  return (
    <section className={`${styles.connect_bg}`}>
      <div className={`${styles.overlay}`}>
        <div className="container py-2">
          <div className="row">
            <div className="col-12">
              <div className={`${styles.meta_main_box}`}>
                <h3>Select Your Wallet</h3>
                <div className={` ${styles.metacard}`}>
                  <div className={`${styles.metabox}`} onClick={handleMetamask}>
                    <img src="./assets/walletimg/metamask.png" alt="" />
                    <p>Metamask</p>
                    <p className={`${styles.defualt_txt}`}>Default</p>
                  </div>

                  {/* 2 */}
                   <div onClick={handleRegister} className={`${styles.metabox}`}>
                    <img src="./assets/walletimg/email.png" alt="" />
                    <p> Register / Create Your Account</p>
                  </div>

                  {/* 3 */}
                  {/* <a href="" className={`${styles.metabox}`}>
                    <img src="./assets/walletimg/bistik.png" alt="" />
                    <p>Bitski</p>
                  </a> */}

                  {/* 4 */}
                  {/* <a href="" className={`${styles.metabox}`}>
                    <img src="./assets/walletimg/walletconnect.png" alt="" />
                    <p>WalletConnect</p>
                  </a>
                  <a href="" className={`${styles.metabox}`}>
                    <img src="./assets/walletimg/venly.png" alt="" />
                    <p>Venly</p>
                  </a> */}

                  <Link href={"/login"} className={`${styles.metabox}`}>
                    <img src="./assets/walletimg/email.png" alt="" />
                    <p> Sign in with email</p>
                  </Link>
                </div>
                {/* <div className="col-12 text-center my-3">
                  <button className={` ${styles.login_btn}`}>
                    <i className="fa-solid fa-wallet mx-2"></i>
                    Sign in with email
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* bottom footer wallet */}

        {/* <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className={`${styles.fotter_bottom}`}>
                <p>
                  {" "}
                  <a href="" className="text-white">
                    Can’t find your wallet?{" "}
                  </a>
                </p>
              </div>

              <div className={` ${styles.fotter_bottom2}`}>
                <p>Secured by Decentrawood</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      <ToastContainer />
    </section>
  );
};
export default page;
