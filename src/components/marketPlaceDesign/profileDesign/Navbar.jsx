import React from "react";
import styles from "./profileDesign.module.css";

const Navbar = ({ assetCode, toggleAssetCode }) => {
  return (
    <>
      <div className="row py-2">
        <div className="col-12">
          <div className={` ${styles.profile_tab}`}>
            <ul className="nav nav-pills mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${styles.profile_cart_tab} ${
                    assetCode == 0 && styles.cus_active
                  }`}
                  onClick={() => toggleAssetCode(0, "Digital Art")}
                >
                  NFT
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${styles.profile_cart_tab} ${
                    assetCode == 1 && styles.cus_active
                  }`}
                  onClick={() => toggleAssetCode(1, "Land")}
                >
                  Ariba
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link  ${styles.profile_cart_tab} ${
                    assetCode == 2 && styles.cus_active
                  }`}
                  onClick={() => toggleAssetCode(2, "City")}
                >
                  Indus
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link  ${styles.profile_cart_tab} ${
                    assetCode == 3 && styles.cus_active
                  }`}
                  onClick={() => toggleAssetCode(3, "3D Models")}
                >
                  3D Models
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link  ${styles.profile_cart_tab} ${
                    assetCode == 4 && styles.cus_active
                  }`}
                  onClick={() => toggleAssetCode(4, "AI_NFT")}
                >
                  AI NFT
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
