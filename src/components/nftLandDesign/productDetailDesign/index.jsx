"use client";
import React, { useEffect, useState } from "react";
import styles from "./productDetailDesign.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { apiUrl } from "../../../../environment";
import { LAND_REDIRECT_SUCCESS } from "@/redux/states/loginState";
import { useDispatch } from "react-redux";
const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [productAllData, setProductAllData] = useState([]);

  const assetsId = searchParams.get("assetsId");
  const cityId = searchParams.get("cityId");
  const category = searchParams.get("category");

  const paramsData = {
    assetsId,
    category,
    cityId,
  };
  const handleGetProductData = async (data) => {
    const { assetsId, category, cityId } = data;
    try {
      const api = `${apiUrl}/asset/getAssets-ByAssetId`;
      const data = {
        assetsId: assetsId,
        category: category,
      };
      const cityData = {
        cityId: cityId,
        category: category,
      };
      const res = await axios.get(api, {
        params: category === "City" ? cityData : data,
      });
      const filterData = res?.data.data;
      setProductAllData(filterData);
    } catch (error) {
      console.log("Error in Product Details", error);
    }
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

  const handleRedirecttoLogin = () => {
    if (category === "City") {
      const redirectLink = `marketdashboard/land/productdetail?cityId=${cityId}&category=${category}`;
      dispatch({ type: LAND_REDIRECT_SUCCESS, payload: redirectLink });
      router.push("/login");
    } else {
      const redirectLink = `marketdashboard/land/productdetail?assetsId=${assetsId}&category=${category}`;
      dispatch({ type: LAND_REDIRECT_SUCCESS, payload: redirectLink });
      router.push("/login");
    }
  };

  useEffect(() => {
    handleGetProductData(paramsData);
  }, [searchParams]);

  return (
    <>
      <div className="container">
        <div className="row my-4">
          <div className="col-md-4 col-12">
            <div className={`card ${styles.card_img_box}`}>
              <div className={` ${styles.cart_img}`}>
                <img
                  src={`${apiUrl}${"/asset/getImages?imageName="}${
                    productAllData?.imageUrl
                  }&pathName=${productAllData?.imagePath}`}
                  alt="000"
                />
              </div>
              <div className={`card-body ${styles.card_body_product}`}>
                <div className="row">
                  <div className="col-5">
                    <div className={` ${styles.cart_price_box}`}>
                      <p>Current Price</p>
                    </div>
                  </div>
                  <div className="col-7">
                    <div className={`${styles.cart_price}`}>
                      <p>{productAllData?.USDprice} USD</p>
                      <div className={` ${styles.doad_price}`}>
                        <img src="/assets/deod.png" alt="" />
                        <p>{productAllData?.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-5">
                        <div className={`${styles.buy_btn_box}`}>
                          <button
                            className={`${styles.buy_btn} `}
                            onClick={() => handleRedirecttoLogin()}
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className={`${styles.cart_icon}`}>
                          <button className="btn btn p-1 shadow-none border-0">
                            {" "}
                            <i className="fa-solid fa-cart-shopping"></i>
                          </button>
                          <button
                            className={`btn btn p-1 cus shadow-none border-0 ${styles.clr_heart}`}
                          >
                            {" "}
                            <i className="fa-solid fa-heart"></i>
                          </button>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className={` ${styles.count_box}`}>
                          <button className={` ${styles.add_btn}`}>
                            <i className="fa-solid fa-minus"></i>
                          </button>
                          <input
                            className={`${styles.count_input}`}
                            type="text"
                            name=""
                            id=""
                            value="1"
                          />
                          <button className={`${styles.add_btn}`}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-7 col-12">
            <div className={`${styles.product_Details}`}>
              <h4>
                {" "}
                {productAllData?.category == "City"
                  ? productAllData?.nameOfCity
                  : productAllData?.nameOfNft}
              </h4>
              <div className={`${styles.within_caption}`}>
                <p>250 Minted</p>
                <span>|</span>
                <p>Listed</p>
                <span>|</span>
                <p>Owner</p>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className={` ${styles.caption_details_box}`}>
                    <div className={`row  my-3${styles.nft_details}`}>
                      <div className="col-md-4 col-12">
                        <div className={` ${styles.nft_within_details}`}>
                          <p>Creator</p>

                          <div className={` ${styles.nft_name_logo}`}>
                            <img src="/assets/deod.png" alt="" />
                            <p>Decentrawood</p>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 col-12">
                        <div className={` ${styles.nft_within_details}`}>
                          <p>Address</p>

                          <div className={` ${styles.nft_name_logo}`}>
                            <p>
                              {start_and_end(
                                "0xE77aBB1E75D2913B2076DD16049992FFeACa5235"
                              )}
                            </p>
                            <i className="fa-regular fa-copy"></i>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 col-12">
                        <div className={` ${styles.nft_within_details}`}>
                          <p>Social Media</p>

                          <div className={` ${styles.nft_name_logo}`}>
                            <p>https://www.decentrawood.com/</p>
                          </div>
                          <div className={` ${styles.socail_box_nft}`}>
                            {/* <div className={` ${styles.within_socail_box}`}>
                              <i className="fa-brands fa-linkedin"></i>
                            </div> */}

                            <a
                              href="https://twitter.com/decentrawood"
                              className={` ${styles.within_socail_box}`}
                              target="_blank"
                            >
                              <i className="fa-brands fa-x-twitter"></i>
                            </a>

                            <a
                              href="https://www.facebook.com/decentrawood"
                              className={` ${styles.within_socail_box}`}
                              target="_blank"
                            >
                              <i className="fa-brands fa-facebook"></i>
                            </a>

                            <a
                              href="https://www.instagram.com/decentrawood/"
                              className={` ${styles.within_socail_box}`}
                              target="_blank"
                            >
                              <i className="fa-brands fa-instagram"></i>
                            </a>

                            <a
                              href="https://youtube.com/@decentrawood-official?si=AbM7EEHWnmWtqkKS"
                              className={` ${styles.within_socail_box}`}
                              target="_blank"
                            >
                              <i className="fa-brands fa-youtube"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={` ${styles.sec_caption_nft_main}`}>
                <div className="row">
                  <div className="col-12">
                    <div className={` ${styles.heding_nft}`}>
                      <h4>Details</h4>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className={` ${styles.caption_details_box2}`}>
                      <div className={`row  my-3${styles.nft_details}`}>
                        <div className="col-md-4 col-6">
                          <div className={` ${styles.nft_within_details2}`}>
                            <p>Type</p>

                            <div className={` ${styles.nft_name_logo2}`}>
                              <p>{productAllData?.category}</p>
                              <img
                                src={`${apiUrl}${"/asset/getImages?imageName="}${
                                  productAllData?.imageUrl
                                }&pathName=${productAllData?.imagePath}`}
                                alt="000"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-6">
                          <div className={` ${styles.nft_within_details2}`}>
                            <p>Owner Address</p>

                            <div className={` ${styles.nft_name_logo2}`}>
                              <p>
                                {" "}
                                {productAllData?.ownedBy === null
                                  ? "None"
                                  : start_and_end(productAllData?.ownedBy)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-6">
                          <div className={` ${styles.nft_within_details2}`}>
                            <p>Sell</p>

                            <div className={` ${styles.nft_name_logo2}`}>
                              <p>
                                {productAllData?.onSale === true
                                  ? "NFT On Sell"
                                  : "None"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={` ${styles.sec_caption_nft_main}`}>
                <div className="row">
                  <div className="col-12">
                    <div className={` ${styles.caption_details_box2}`}>
                      <div className={`row  my-3${styles.nft_details}`}>
                        <div className="col-md-4 col-5">
                          <div className={` ${styles.nft_within_details2}`}>
                            <p>Blockchain</p>

                            <div className={` ${styles.nft_name_logo2}`}>
                              <span className={` ${styles.dot_box}`}></span>
                              <p>BSC</p>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-7">
                          <div className={` ${styles.nft_within_details2}`}>
                            <p>Token ID</p>

                            <div className={` ${styles.nft_name_logo2}`}>
                              <p>
                                {productAllData?.category == "City"
                                  ? productAllData?.cityId
                                  : productAllData?.assetsId}
                              </p>
                              <i className="fa-regular fa-copy "></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 */}

              <div className={` ${styles.sec_caption_nft_description}`}>
                <div className="row">
                  <div className="col-12">
                    <div className={` ${styles.heding_description}`}>
                      <h4>Description</h4>
                    </div>

                    <p>{productAllData?.description}</p>
                  </div>
                </div>

                {/* 22 */}

                <div className="row">
                  <div className="col-12">
                    <div className={` ${styles.heding_description}`}>
                      <h4>Share in</h4>
                    </div>
                    <div className={` ${styles.socail_box_nft}`}>
                      {/* <a href="" className={` ${styles.within_socail_box}`}>
                        <i className="fa-brands fa-linkedin"></i>
                      </a> */}

                      <a
                        href="https://twitter.com/decentrawood"
                        className={` ${styles.within_socail_box}`}
                        target="_blank"
                      >
                        <i className="fa-brands fa-x-twitter"></i>
                      </a>

                      <a
                        href="https://www.facebook.com/decentrawood"
                        className={` ${styles.within_socail_box}`}
                        target="_blank"
                      >
                        <i className="fa-brands fa-facebook"></i>
                      </a>

                      <a
                        href="https://www.instagram.com/decentrawood/"
                        className={` ${styles.within_socail_box}`}
                        target="_blank"
                      >
                        <i className="fa-brands fa-instagram"></i>
                      </a>

                      <a
                        href="https://youtube.com/@decentrawood-official?si=AbM7EEHWnmWtqkKS"
                        className={` ${styles.within_socail_box}`}
                        target="_blank"
                      >
                        <i className="fa-brands fa-youtube"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
