"use client";
import React, { useEffect, useState } from "react";
import styles from "./productDetailDesign.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { apiUrl } from "../../../../environment";
import ProceedModal from "./proceedModal";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../loaderDesign/index";
import {
  deodAribaContract,
  deodAribaContractAbi,
  deodAribaMarketPlaceContract,
  deodAribaMarketPlaceContractAbi,
  deodIndusContract,
  deodIndusContractAbi,
  deodTokenContract,
  deodTokenContractAbi,
} from "@/abi/Abi";
import { isCityBlock, istokenBlock } from "@/abi/Data";
const page = () => {
  const searchParams = useSearchParams();
  const assetsId = searchParams.get("assetsId");
  const cityId = searchParams.get("cityId");
  const category = searchParams.get("category");
  const paramsData = {
    assetsId,
    category,
    cityId,
  };
  const [productAllData, setProductAllData] = useState([]);
  const [spineLoading, setSpineLoadding] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const address = localStorage.getItem("address");

  const handleGetProductData = async (data) => {
    const { assetsId, category, cityId } = data;
    try {
      const api = `${apiUrl}/asset/getAuthAssets-ByAssetId`;
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

  // const handleFistAribaApprove = async () => {
  //   debugger;
  //   setSpineLoadding(true);
  //   try {
  //     const accountAddress = localStorage.getItem("address");
  //     let provider;
  //     if (window.ethereum) {
  //       provider = window.ethereum;
  //     } else if (window.web3) {
  //       provider = window.web3.currentProvider;
  //     } else {
  //       window.alert("No ethereum browser !checkout metamask");
  //     }
  //     if (provider) {
  //       if (provider !== window.ethereum) {
  //         console.error(
  //           "Not window.ethereum.Do you have multiple wallets installed"
  //         );
  //       }
  //       await provider.request({
  //         method: "eth_requestAccounts",
  //       });
  //     }
  //     const newProvider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = newProvider.getSigner();
  //     const accounts = await signer.getAddress();
  //     const addToLower = accounts.toLowerCase();
  //     if (accountAddress == addToLower) {
  //       const DEODApprove = new ethers.Contract(
  //         deodTokenContract,
  //         deodTokenContractAbi,
  //         signer
  //       );
  //       let deodPriceAdd = Number(productAllData?.price) + 1;
  //       deodPriceAdd = deodPriceAdd.toString();
  //       let a = ethers.utils.parseUnits(deodPriceAdd, "ether").toString();
  //       const txn = await DEODApprove.approve(deodAribaContract, a);
  //       const receipttxn = await txn.wait();
  //       console.log(receipttxn);
  //       if (receipttxn.status !== 1) {
  //         alert("error message");
  //       } else {
  //         setProceed(true);
  //       }
  //     } else {
  //       toast.error("please connect correct wallet", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //       setSpineLoadding(false);
  //     }
  //   } catch (error) {
  //     const output = JSON.stringify(error);
  //     const outputInObj = JSON.parse(output);
  //     const err = outputInObj.reason;
  //     toast.error(err, {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //   }
  //   setSpineLoadding(false);
  // };
  // const handleFistAribaProceed = async () => {
  //   debugger;
  //   setMainLoading(true);
  //   try {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = await provider.getSigner();
  //     const DEODLand = new ethers.Contract(
  //       deodAribaContract,
  //       deodAribaContractAbi,
  //       signer
  //     );
  //     let a = ethers.utils
  //       .parseUnits(productAllData?.price, "ether")
  //       .toString();
  //     const refferalAddress = localStorage.getItem("refferalAddress");
  //     const txn = await DEODLand.mintLand(
  //       productAllData.assetsId,
  //       productAllData.size,
  //       productAllData.x,
  //       productAllData.y,
  //       productAllData.z,
  //       a,
  //       refferalAddress
  //     );
  //     const reciept = await txn.wait();
  //     if (reciept.status === 1) {
  //       var currentDate = new Date();
  //       const today = currentDate.toLocaleDateString();
  //       const api = `${apiUrl}/asset/buyLandNFT`;
  //       const data = {
  //         assetsId: productAllData?.assetsId,
  //         minted: true,
  //         // buyDate: today,
  //         atUsdPrice: productAllData?.USDprice,
  //         transactionHash: reciept.transactionHash,
  //       };
  //       const resp = await axios.post(api, data);
  //       console.log(resp);
  //       toast.success("Land Minted Successfully");
  //       setTimeout(() => {
  //         router.push("/marketdashboard");
  //       }, 3000);
  //     } else {
  //       toast.error("Transaction failed");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     const obj = JSON.stringify(error);
  //     const obj2 = JSON.parse(obj);
  //     const obj3 = obj2.reason;
  //     toast.error(obj3, {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //   }
  //   setMainLoading(false);
  // };
  // const handleSecondAribaApprove = async () => {
  //   setSpineLoadding(true);
  //   try {
  //     const accountAddress = localStorage.getItem("address");
  //     let provider;
  //     if (window.ethereum) {
  //       provider = window.ethereum;
  //     } else if (window.web3) {
  //       provider = window.web3.currentProvider;
  //     } else {
  //       window.alert("No ethereum browser !checkout metamask");
  //     }
  //     if (provider) {
  //       if (provider !== window.ethereum) {
  //         console.error(
  //           "Not window.ethereum.Do you have multiple wallets installed"
  //         );
  //       }
  //       await provider.request({
  //         method: "eth_requestAccounts",
  //       });
  //     }
  //     const newProvider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = newProvider.getSigner();
  //     const accounts = await signer.getAddress();
  //     const addToLower = accounts.toLowerCase();
  //     if (accountAddress == addToLower) {
  //       const DEODApprove = new ethers.Contract(
  //         deodTokenContract,
  //         deodTokenContractAbi,
  //         signer
  //       );
  //       let a = ethers.utils
  //         .parseUnits(productAllData?.price, "ether")
  //         .toString();
  //       const txn = await DEODApprove.approve(deodAribaMarketPlaceContract, a);
  //       const receipttxn = await txn.wait();
  //       if (receipttxn.status !== 1) {
  //         alert("error message");
  //       } else {
  //         setProceed(true);
  //       }
  //     } else {
  //       toast.error("please connect correct wallet", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //       setSpineLoadding(false);
  //     }
  //   } catch (error) {
  //     const output = JSON.stringify(error);
  //     const outputInObj = JSON.parse(output);
  //     const err = outputInObj.reason;
  //     toast.error(err, {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //   }
  //   setSpineLoadding(false);
  // };
  // const handleSecondAribaProceed = async () => {
  //   setMainLoading(true);
  //   try {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     let a = ethers.utils.parseUnits(assetData?.price, "ether").toString();
  //     const landMarket = new ethers.Contract(
  //       deodAribaMarketPlaceContract,
  //       deodAribaMarketPlaceContractAbi,
  //       signer
  //     );
  //     const refferalAddress = localStorage.getItem("refferalAddress");
  //     const buynft = await landMarket.buyNFT(
  //       deodAribaContract,
  //       productAllData.assetsId,
  //       a,
  //       refferalAddress
  //     );
  //     const reciept = await buynft.wait();
  //     if (reciept.status === 1) {
  //       var currentDate = new Date();
  //       const today = currentDate.toLocaleDateString();
  //       const api = `${apiUrl}/asset/buyLandNFT`;
  //       const data = {
  //         assetsId: productAllData.assetsId,
  //         minted: true,
  //         buyDate: today,
  //         atUsdPrice: productAllData?.usdPrice,
  //       };
  //       const resp = await axios.post(api, data);
  //       console.log(resp);
  //       toast.success("Land Minted Successfully");
  //       setTimeout(() => {
  //         router.push("/marketdashboard");
  //       }, 3000);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     const obj = JSON.stringify(error);
  //     const obj2 = JSON.parse(obj);
  //     const obj3 = obj2.reason;
  //     toast.error(obj3, {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //   }
  //   setMainLoading(false);
  // };
 const handleFistAribaApprove = ()=>{
  toast.info('Feature on Maintenance')
 }
 const handleFistAribaProceed = ()=>{
  toast.info('Feature on Maintenance')
 }
 const handleSecondAribaApprove = ()=>{
  toast.info('Feature on Maintenance')
 }
 const handleSecondAribaProceed = ()=>{
  toast.info('Feature on Maintenance')
 }

  const handleFistCityApprove = async () => {
    setSpineLoadding(true);
    try {
      const accountAddress = localStorage.getItem("address");
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
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = newProvider.getSigner();
      const accounts = await signer.getAddress();
      const addToLower = accounts.toLowerCase();
      if (accountAddress == addToLower) {
        const DEODApprove = new ethers.Contract(
          deodTokenContract,
          deodTokenContractAbi,
          signer
        );
        let deodPriceAdd = Number(productAllData?.price) + 1;
        deodPriceAdd = deodPriceAdd.toString();
        let a = ethers.utils.parseUnits(deodPriceAdd, "ether").toString();
        const txn = await DEODApprove.approve(deodIndusContract, a);
        const receipttxn = await txn.wait();
        if (receipttxn.status !== 1) {
          alert("error");
        } else {
          setProceed(true);
        }
      } else {
        toast.error("please connect correct wallet", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setSpineLoadding(false);
      }
    } catch (error) {
      const output = JSON.stringify(error);
      const outputInObj = JSON.parse(output);
      const err = outputInObj.reason;
      toast.error(err, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setSpineLoadding(false);
  };

  const handleFistCityProceed = async () => {
    setMainLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const DEODLand = new ethers.Contract(
        deodIndusContract,
        deodIndusContractAbi,
        signer
      );
      const refferalAddress = localStorage.getItem("refferalAddress");
      let a = ethers.utils
        .parseUnits(productAllData?.price, "ether")
        .toString();
      const txn = await DEODLand.mintLand(
        productAllData.cityId,
        productAllData.size,
        productAllData.x,
        productAllData.y,
        productAllData.z,
        a,
        refferalAddress
      );
      const reciept = await txn.wait();
      if (reciept.status === 1) {
        var currentDate = new Date();
        const today = currentDate.toLocaleDateString();
        const api = `${apiUrl}/city/buyCity`;
        const data = {
          cityId: productAllData?.cityId,
          assetsId: productAllData?.assetsId,
          minted: true,
          // buyDate: today,
          atUsdPrice: productAllData?.USDprice,
          transactionHash: reciept.transactionHash,
        };
        const resp = await axios.post(api, data);
        console.log(resp);
        toast.success("City Land Minted Successfully");
        setTimeout(() => {
          router.push("/marketdashboard");
        }, 3000);
      } else {
        toast.error("Transaction failed");
      }
    } catch (error) {
      console.log(error);
      console.log("sell Aprove error", error);
      const obj = JSON.stringify(error);
      const obj2 = JSON.parse(obj);
      const obj3 = obj2.reason;
      toast.error(obj3, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setMainLoading(false);
  };

  useEffect(() => {
    handleGetProductData(paramsData);
  }, [searchParams]);

  console.log("productAllData", productAllData);
  return (
    <>
      {mainLoading && <Loader />}
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
                      {productAllData &&
                        (productAllData?.ownedBy === null ||
                          productAllData?.ownedBy !== address) && (
                          <>
                            {productAllData?.onSale === null && (
                              <>
                                {istokenBlock.indexOf(assetsId) != -1 ||
                                isCityBlock.indexOf(cityId) != -1 ? (
                                  <div className="col-5">
                                    <div className={`${styles.buy_btn_box}`}>
                                      <button className={`${styles.buy_btn} `}>
                                        Reserved NFT <h7>(Not for sale)</h7>
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="col-5">
                                    <div className={`${styles.buy_btn_box}`}>
                                      <button
                                        className={`${styles.buy_btn} `}
                                        onClick={() => setShowModal(true)}
                                      >
                                        Buy Now
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                            {productAllData?.onSale && (
                              <div className="col-9">
                                <button
                                  className="cus-btnn"
                                  onClick={() => setVisibility(!visibility)}
                                >
                                  Buy Now
                                </button>
                              </div>
                            )}
                          </>
                        )}
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
      {productAllData?.onSale ? (
        // for second buy Land
        <ProceedModal
          showModal={showModal}
          setShowModal={setShowModal}
          proceed={proceed}
          setProceed={setProceed}
          handleApprove={handleSecondAribaApprove}
          handleProceed={handleSecondAribaProceed}
          spineLoading={spineLoading}
        />
      ) : (
        // for fisrt buy land
        <ProceedModal
          showModal={showModal}
          setShowModal={setShowModal}
          proceed={proceed}
          setProceed={setProceed}
          handleApprove={
            productAllData?.category === "Land"
              ? handleFistAribaApprove
              : productAllData?.category === "City"
              ? handleFistCityApprove
              : null
          }
          handleProceed={
            productAllData?.category === "Land"
              ? handleFistAribaProceed
              : productAllData?.category === "City"
              ? handleFistCityProceed
              : null
          }
          spineLoading={spineLoading}
        />
      )}
      <ToastContainer />
    </>
  );
};

export default page;
