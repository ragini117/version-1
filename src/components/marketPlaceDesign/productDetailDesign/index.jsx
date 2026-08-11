"use client";
import React, { useEffect, useState } from "react";
import styles from "./productDetailDesign.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { apiUrl } from "../../../../environment";
import CopyToClipboard from "react-copy-to-clipboard";
import ProceedModal from "./proceedModal";
import { ethers } from "ethers";
import { BigNumber } from "bignumber.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../loaderDesign/index";
import {
  deodNftContract,
  deodNftContractAbi,
  deodNftMarketPlaceContract,
  deodNftMarketPlaceContractAbi,
  deodTokenContract,
  deodTokenContractAbi,
} from "@/abi/Abi";
const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productAllData, setProductAllData] = useState([]);
  const [spineLoading, setSpineLoadding] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const address = localStorage.getItem("address");
  const refferalAddress = localStorage.getItem("refferalAddress");

  const handleGetProductData = async (data) => {
    const { assetsId, category } = data;
    try {
      const api = `${apiUrl}/asset/getAssets-ByAssetId`;
      const data = {
        assetsId: assetsId,
        category: category,
      };
      const res = await axios.get(api, {
        params: data,
      });
      const filterData = res?.data.data;
      setProductAllData(filterData);
    } catch (error) {
      console.log("Error in Product Details", error);
    }
  };

  const handleFistNftApprove = async () => {
    setSpineLoadding(true);
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
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = newProvider.getSigner();
      const accounts = await signer.getAddress();
      const addToLower = accounts.toLowerCase();
      if (address == addToLower) {
        const DEODApprove = new ethers.Contract(
          deodTokenContract,
          deodTokenContractAbi,
          signer
        );
        let a = ethers.utils
          .parseUnits(productAllData?.price, "ether")
          .toString();
        const txn = await DEODApprove.approve(deodNftContract, a);
        const receipttxn = await txn.wait();
        if (receipttxn.status !== 1) {
          alert("error message");
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

  const handleFistNftProceed = async () => {
    setMainLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const DEODFirstBuy = new ethers.Contract(
        deodNftContract,
        deodNftContractAbi,
        signer
      );
      const referralAddress = refferalAddress;
      const txn = await DEODFirstBuy.getNFT(
        productAllData?.assetsId,
        referralAddress
      );
      const receipttxn = await txn.wait();
      if (receipttxn.status !== 1) {
        toast.error("Error", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        await handleBuyMintedFirstNft(receipttxn);
        router.push("/marketdashboard");
        toast.success("NFT Buy Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      const output = JSON.stringify(error);
      const outputInObj = JSON.parse(output);
      const err = outputInObj.reason;
      toast.error(err, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setMainLoading(false);
  };

  const handleBuyMintedFirstNft = async (reciept) => {
    try {
      // date
      var today = new Date();
      var year = today.getFullYear();
      var mes = today.getMonth() + 1;
      var dia = today.getDate();
      var date = dia + "/" + mes + "/" + year;
      const api = `${apiUrl}/asset/buyMintedNFT`;
      const data = {
        // assetsId: productAllData?.assetsId,
        // minted: true,
        // buyDate: date,
        // atUsdPrice: productAllData?.usdPrice,
        assetsId: productAllData?.assetsId,
        minted: true,
        // buyDate: today,
        atUsdPrice: productAllData?.USDprice,
        transactionHash: reciept.transactionHash,
      };
      axios.post(api, data).then((res) => {
        console.log("handleBuyMintedNFT", res);
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSecondNftApprove = async () => {
    setSpineLoadding(true);
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
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = newProvider.getSigner();
      const accounts = await signer.getAddress();
      const addToLower = accounts.toLowerCase();
      if (address == addToLower) {
        const DEODSecondApprove = new ethers.Contract(
          deodTokenContract,
          deodTokenContractAbi,
          signer
        );
        const DEODNftSecondBuy = new ethers.Contract(
          deodNftMarketPlaceContract,
          deodNftMarketPlaceContractAbi,
          signer
        );
        const sellprice = DEODNftSecondBuy.getNFTpriceWithTxn(
          deodNftContract,
          productAllData?.assetsId
        );
        const txn = await DEODSecondApprove.approve(
          deodNftMarketPlaceContract,
          sellprice
        );
        const receipttxn = await txn.wait();
        if (receipttxn.status !== 1) {
          alert("error message");
        } else {
          setProceed(true);
        }
      } else {
        toast.error("please connect correct wallet", {
          position: toast.POSITION.TOP_RIGHT,
        });
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

  const handleSecondProceed = async () => {
    setMainLoading(true);
    try {
      let a = ethers.utils
        .parseUnits(productAllData?.price, "ether")
        .toString();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const DEODNftSecondBuy = new ethers.Contract(
        deodNftMarketPlaceContract,
        deodNftMarketPlaceContractAbi,
        signer
      );
      const sellprice = DEODNftSecondBuy.getNFTpriceWithTxn(
        deodNftContract,
        productAllData?.assetsId
      );
      const referralAddress = refferalAddress;
      const txn = await DEODNftSecondBuy.buyNFT(
        deodNftContract,
        productAllData?.assetsId,
        sellprice,
        referralAddress
      );
      const receipttxn = await txn.wait();
      if (receipttxn.status !== 1) {
        toast.error("Error", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        await handleBuyMintedSecondNft(receipttxn);
        toast.success("NFT Buy Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push("/marketdashboard");
      }
    } catch (error) {
      const output = JSON.stringify(error);
      const outputInObj = JSON.parse(output);
      const err = outputInObj.reason;
      toast.error(err, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setMainLoading(false);
  };

  const handleBuyMintedSecondNft = async (reciept) => {
    try {
      // date
      var today = new Date();
      var year = today.getFullYear();
      var mes = today.getMonth() + 1;
      var dia = today.getDate();
      var date = dia + "/" + mes + "/" + year;

      const api = `${apiUrl}/asset/buyMintedNFT`;
      const data = {
        // assetsId: productAllData?.assetsId,
        // minted: true,
        // buyDate: date,
        // atUsdPrice: productAllData?.usdPrice,
        assetsId: productAllData?.assetsId,
        minted: true,
        // buyDate: today,
        atUsdPrice: productAllData?.USDprice,
        transactionHash: reciept.transactionHash,
      };
      axios.post(api, data).then((res) => {
        console.log("handleBuyMintedNFT", res);
      });
    } catch (error) {
      toast.error("Error", {
        position: toast.POSITION.TOP_RIGHT,
      });
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

  useEffect(() => {
    const assetsId = searchParams.get("assetsId");
    const category = searchParams.get("category");
    const paramsData = {
      assetsId,
      category,
    };
    handleGetProductData(paramsData);
  }, [searchParams]);

  console.log("productAllData", productAllData?.nameOfNft);
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
                  }&pathName=ASSET_IMAGE_PATH_NFT`}
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
                            {/* fitst buy */}
                            {productAllData?.onSale === null && (
                              <>
                                <div className="col-5">
                                  <div className={`${styles.buy_btn_box}`}>
                                    <button
                                      className={`${styles.buy_btn} `}
                                      onClick={() => setShowModal(true)}
                                    >
                                      Buy Now First
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                            {/* second buy */}
                            {productAllData?.onSale && (
                              <>
                                <div className="col-5">
                                  <div className={`${styles.buy_btn_box}`}>
                                    <button
                                      className={`${styles.buy_btn} `}
                                      onClick={() => setShowModal(true)}
                                    >
                                      Buy Now second
                                    </button>
                                  </div>
                                </div>
                              </>
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
                    {productAllData?.ownedBy === address && (
                      <div className="text-danger fw-bold my-4">
                        You cannot buy this product as you are the owner
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-7 col-12">
            <div className={`${styles.product_Details}`}>
              <h4>{productAllData?.nameOfNft}</h4>
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
                            <CopyToClipboard
                              text="0xE77aBB1E75D2913B2076DD16049992FFeACa5235"
                              onCopy={() => alert("copied")}
                            >
                              <i
                                className="fa-regular fa-copy"
                                style={{ cursor: "pointer" }}
                              ></i>
                            </CopyToClipboard>
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
                              {/* <img src="/assets/Pic-3.png" alt="" /> */}
                              <img
                                src={`${apiUrl}${"/asset/getImages?imageName="}${
                                  productAllData?.imageUrl
                                }&pathName=ASSET_IMAGE_PATH_NFT`}
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
                              <p>{productAllData?.assetsId}</p>
                              <CopyToClipboard
                                text={productAllData?.assetsId}
                                onCopy={() => alert("copied")}
                              >
                                <i
                                  className="fa-regular fa-copy"
                                  style={{ cursor: "pointer" }}
                                ></i>
                              </CopyToClipboard>
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
      {/* Modal  */}
      {productAllData?.onSale ? (
        // second buy nft
        <ProceedModal
          showModal={showModal}
          setShowModal={setShowModal}
          proceed={proceed}
          setProceed={setProceed}
          handleApprove={handleSecondNftApprove}
          handleProceed={handleSecondProceed}
          spineLoading={spineLoading}
        />
      ) : (
        // fisrt buy nft
        <ProceedModal
          showModal={showModal}
          setShowModal={setShowModal}
          proceed={proceed}
          setProceed={setProceed}
          handleApprove={handleFistNftApprove}
          handleProceed={handleFistNftProceed}
          spineLoading={spineLoading}
        />
      )}
      <ToastContainer />
    </>
  );
};

export default page;
