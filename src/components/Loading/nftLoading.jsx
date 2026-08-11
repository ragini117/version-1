import React from "react";
import styles from "./nftLoadinf.module.css";

const NftLoading = () => {
  return (
    <div className={`${styles.skeleton_content}`}>
      <div className="container">
        <div className="row g-3">
          <div className="col-12">
            <h5 className={`${styles.skeleton_title_text}`}>
              {" "}
              All NFTs{" "}
              <span
                className={`ml-2 p-2 ${styles.skeleton_total_count}`}
              ></span>
            </h5>
          </div>
          {[...new Array(8)]?.map((value, key) => {
            return (
              <div className="col-12 col-md-3">
                <div className={`${styles.skeleton_card_new}`}>
                  <div
                    className={`${styles.skeleton} ${styles.skeleton_card_new_img}`}
                  ></div>
                  <div>
                    <h5></h5>
                    <div className={` ${styles.skeleton_card_text}`}>
                      <div className="row">
                        <div className="col-8">
                          <div
                            className={`${styles.skeleton} ${styles.skeleton_head}`}
                          >
                            <h2 className=""></h2>
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className={`${styles.skeleton} ${styles.skeleton_price_box}`}
                          >
                            <p className="text-white"></p>
                          </div>
                          <div
                            className={`${styles.skeleton} ${styles.skeleton_price_box}`}
                          >
                            <p className="text-white"></p>
                          </div>
                          <button
                            className={`${styles.skeleton}  ${styles.skeleton_buy_button}`}
                          ></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NftLoading;
