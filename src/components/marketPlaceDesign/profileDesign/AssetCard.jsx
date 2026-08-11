import { apiUrl } from "../../../../environment";
import Modal from "./Modal";
import styles from "./profileDesign.module.css";
import React, { useState } from "react";

const AssetCard = ({ data }) => {
  return (
    <>
      <div className="col-12">
        <div
          className={` ${styles.profile_tab_card_box}`}
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
        >
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <div className={`card ${styles.card_prfile_product}`}>
                <div className="row ">
                  <div className="col-md-7 col-12">
                    <div className="row align-items-center">
                      <div className="col-md-6 col-12">
                        <div className={` ${styles.prfile_cart_img}`}>
                          <img
                            src={data.category=='AI_NFT'? `${apiUrl}/asset/getImages?pathName=AI_IMAGE_GENERATION&imageName=${data.image_url}` :`${apiUrl}/asset/getImages?imageName=${data?.imageUrl[0]}&pathName=${data?.imagePath}`}
                            
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className={` ${styles.prfile_cart_caption}`}>
                          <h3> {data?.nameOfNft}</h3>
                          <p>{data?.description}</p>
                        </div>
                        {data?.onSale && (
                          <div>
                            <h5 className="text-danger fw-bold">
                              Product on sale
                            </h5>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5 col-12">
                    <div className={` ${styles.prfile_data_caption}`}>
                      <div className={` ${styles.rank_box}`}>
                        <p>#{data?.assetsId || data?.cityId}</p>
                      </div>
                      <div className={` ${styles.data_rank2box}`}>
                        <p>Type</p>
                        <p>{data?.category}</p>
                      </div>

                      <div className={` ${styles.data_rank2box}`}>
                        <p>Quantity</p>
                        <p>1</p>
                      </div>

                      <div className={` ${styles.data_rank3box}`}>
                        <p>Purchased</p>
                        <p>{data?.buyDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              ...
            </div>
            <div
              className="tab-pane fade"
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
            >
              ...
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetCard;
