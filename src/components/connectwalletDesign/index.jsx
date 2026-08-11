import Link from "next/link";
import styles from "./connectwalletDesign.module.css";
import { useRouter } from "next/navigation";
const page = () => {
  const router = useRouter();
  const handleContinueWallet = () => {
    router.push("/metawallet");
  };
  const handlePlayasGuest = () => {
    router.push("/playasguest");
  };
  return (
    <>
      <section className={`${styles.connect_bg}`}>
        <div className="container py-2">
          <div className="row align-items-center">
            <div className="col-12">
              <div className={`${styles.connect_main_box}`}>
                <div className="row">
                  <div className="col-12 col-md-12">
                    <div className={`text-center ${styles.wallet_caption}`}>
                      <h2 className="">Sign In or Create an Account</h2>
                      <h1
                        className="d-md-block d-none" >{" "}
                        Enter the World of Decentrawood!
                      </h1> 
                      <h4 className="mb-4">Ready to explore a new world? </h4>
                      {/* <h4>Sign in or create an account to begin your journey in Decentrawood.</h4> */}
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mx-auto">
                    <div className="row justify-content-center">
                      <div className="col-12 col-md-6">
                        <div className={`${styles.wallet_connect}`}>
                          <div className={`${styles.wallet_button_box}`}>
                            <div className={`${styles.wallet_img}`}>
                              <img src="./assets/wallet.png" alt="" />
                            </div>

                            <button
                              className={`my-2 ${styles.cus_connect_btn}`}
                              onClick={handleContinueWallet}
                            >
                              Continue With Wallet
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className={`${styles.wallet_connect}`}>
                          <div className={`${styles.wallet_button_box}`}>
                            <div className={`${styles.wallet_img}`}>
                              <img src="./assets/guest.png" alt="" />
                            </div>
                            <button
                              className={`my-2 ${styles.connect_guest_btn}`}
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal4"
                            >
                              Continue as a Guest
                            </button>
                          </div>
                          ``
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12 text-center">
                          <div className={`${styles.fotter_bottom2}`}>
                            <p>
                              {" "}
                              Already have an account?
                              <Link href={"/login"} className={`${styles.linkclr}`}> Login</Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className={`${styles.fotter_bottom}`}>
                <p>
                  {" "}
                  Already have an account?
                  <a href=""> Login?</a>
                </p>
              </div>
            </div>
          </div>
        </div> */}

        <div
          className="modal fade"
          id="exampleModal4"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel4"
          aria-hidden="flase"
        >
          <div className="modal-dialog">
            <div className={`modal-content ${styles.map_content}`}>
              <div className="modal-header border-0">
                <h5 className="modal-title" id="exampleModalLabel">
                  Play as guest
                </h5>
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
                  <div className="col-12 text-center">
                    <div className={` ${styles.map_img_box}`}>
                      <div className={` ${styles.map_img}`}>
                        <img src="/assets/playAsGuestimg.png" alt="" />
                        {/* </div>
                    <button className={` ${styles.map_btn}`}>Ariba zone</button> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`card-footer border-0  ${styles.card_footer_cus}`}
                >
                  <button
                    className={`${styles.map_btn}`}
                    onClick={handlePlayasGuest}
                    data-bs-dismiss="modal"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default page;
