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
import Loader from "../../../components/loaderDesign/index";
import {
  deodPropsContract,
  deodPropsContractAbi,
  deodTokenContract,
  deodTokenContractAbi,
  deodTokenContractBNB,
  deodTokenContractBNBAbi,
} from "@/abi/Abi";

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productAllData, setProductAllData] = useState([]);
  const [spineLoading, setSpineLoadding] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading ,setLoading] = useState(false)
  const address = localStorage.getItem("address");
  const refferalAddress = localStorage.getItem("refferalAddress");

  const propId = searchParams.get("propId");
  const category = searchParams.get("category");
  const modelId = searchParams.get("modelId");
 const networkData = {
    sepolia: {
      chainId: "0xaa36a7",
      chainName: "Sepolia Testnet",
      nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://rpc.sepolia.org"],
      blockExplorerUrls: ["https://sepolia.etherscan.io"],
    },
    bnbTestnet: {
      chainId: "0x61",
      chainName: "BNB Smart Chain Testnet",
      nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
      rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
      blockExplorerUrls: ["https://testnet.bscscan.com"],
    },

    /* --- BSC MAINNET --- */
    bsc: {
      chainId: "0x38", // 56 decimal
      chainName: "BNB Smart Chain Mainnet",
      nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
      rpcUrls: ["https://bsc-dataseed.binance.org/"],
      blockExplorerUrls: ["https://bscscan.com"],
    },

    /* --- POLYGON MAINNET --- */
    polygon: {
      chainId: "0x89", // 137 decimal
      chainName: "Polygon Mainnet",
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      rpcUrls: ["https://polygon-rpc.com/"],
      blockExplorerUrls: ["https://polygonscan.com"],
    },
  };
  const switchNetworks = async (networkName) => {
    const network = networkData[networkName];
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainId }],
      });
      console.log("network switched");
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [network],
          });
          console.log("network switched");
        } catch (addError) {
          console.log(addError);
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  };
  const handleGetProductData = async (data) => {
    setLoading(true)
    const { category, propId } = data;
    console.log("data", data);
    try {
      const api = `${apiUrl}/asset/getAuthAssets-ByAssetId`;
      const data = {
        propId: propId,
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
    setLoading(false)

  };

  const handlePropsApprove = async () => {
    
    setSpineLoadding(true);    
    setLoading(true)
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
      switchNetworks('bsc')
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = newProvider.getSigner();
      const accounts = await signer.getAddress();
      const addToLower = accounts.toLowerCase();
      if (address == addToLower) {
        const DEODPropsApprove = new ethers.Contract(
          deodTokenContractBNB,
          deodTokenContractBNBAbi,
          signer
        );
        let a = ethers.utils
          // .parseUnits("1", "ether")
          .parseUnits(productAllData?.price, "ether")
          .toString();
        const txn = await DEODPropsApprove.approve(deodPropsContract, a);
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
    setLoading(false)

  };

  const handlePropsProceed = async () => {
    setLoading(true)
    setMainLoading(true);
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
      await handleCheckIsvalidAddress();
      const getOwnerAddress = localStorage.getItem("ownerAddress");
      console.log("getOwnerAddress", getOwnerAddress);
      if (getOwnerAddress !== "" && getOwnerAddress !== null) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const PropsBuyNft = new ethers.Contract(
            deodPropsContract,
            deodPropsContractAbi,
            signer
          );
          let a = ethers.utils
          // .parseUnits("1", "ether")
            .parseUnits(productAllData?.price, "ether")
            .toString();
          const txn = await PropsBuyNft.generate(getOwnerAddress, propId, a);
          const receipttxn = await txn.wait();
          if (receipttxn.status !== 1) {
            toast.error("Error", {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else {
            await handlePaymentApi(receipttxn, getOwnerAddress);
          }
        } catch (error) {
          console.log("error", error);
          const obj = JSON.stringify(error);
          const obj2 = JSON.parse(obj);
          const obj3 = obj2.reason;
          toast.error(obj3, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    } catch (error) {
      console.log("payment error", error);
      const output = JSON.stringify(error);
      const outputInObj = JSON.parse(output);
      const err = outputInObj.reason;
      toast.error(err, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setMainLoading(false);
    setLoading(false)

  };

  const handleCheckIsvalidAddress = async () => {
    const accountAddress = localStorage.getItem("address");
    if (accountAddress && propId && modelId) {
      try {
        const api = `${apiUrl}/payment/payment-user-validation`;
        const ajax = {
          accountId: accountAddress,
          propId,
          modelId,
          propName: productAllData?.propName,
        };
        const res = await axios.post(api, ajax);
        if (res.data.status === true) {
          localStorage.setItem("ownerAddress", res.data.owner);
        }
      } catch (error) {
        if (error.response.status === 400) {
          const message_400 = error?.response?.data?.message;
          localStorage.setItem("ownerAddress", "");
          toast.error(message_400, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (error.response.status === 401) {
          const message_401 = error?.response?.data?.message;
          localStorage.setItem("ownerAddress", "");
          toast.error(message_401, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          localStorage.setItem("ownerAddress", "");
          toast.error("something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  };

  const handlePaymentApi = async (receipttxn, getOwnerAddress) => {
    setLoading(true)
    const accountAddress = localStorage.getItem("address");
    const payload = {
      accountId: accountAddress,
      modelId,
      modelName: productAllData?.modelName,
      propId,
      propName: productAllData?.propName,
      deodPrice: productAllData?.price,
      ownerAddress: getOwnerAddress,
      propAssetUri: productAllData?.metadataURL,
      transcationHash: receipttxn?.transactionHash,
    };
    const paymentApi = `${apiUrl}/payment/payment-request`;
    try {
      const res = await axios.post(paymentApi, payload);
      if (res.data.status === true) {
        if (res?.data?.modelName === "Ram Mandir") {
          alert(res.data.message);
          router.push(
            "https://spiritualzone.s3.ap-south-1.amazonaws.com/4003_Multiplayer/index.html"
          );
        }
        if (res?.data?.modelName === "Tirupathi Balaji Temple") {
          alert(res.data.message);
          router.push(
            "https://spiritualzone.s3.ap-south-1.amazonaws.com/4197_Multiplayer_Test/index.html"
          );
        }
        if (res?.data?.modelName === "Cupid Hub") {
          alert(res.data.message);
          router.push(
            "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/Cupid_Hub_Web_New_Final+V2/index.html"
          );
        }
        if (res?.data?.modelName === "Mahakaleshwar Temple") {
          alert(res.data.message);
          router.push(
            "https://spiritualzone.s3.ap-south-1.amazonaws.com/4009_Multiplayer_T/index.html"
          );
        }
      }
    } catch (error) {
      if (error.response.status === 400) {
        const message_400 = error?.response?.data?.message;
        toast.error(message_400, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (error.response.status === 401) {
        const message_401 = error?.response?.data?.message;
        toast.error(message_401, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (error.response.status === 500) {
        const message_500 = error?.response?.data?.message;
        toast.error(message_500, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error("something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
    setLoading(false)
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
    const paramsData = {
      propId,
      category,
      modelId,
    };
    handleGetProductData(paramsData);
  }, [searchParams]);

  return (
    <>
      <div className="container">
      {loading && <Loader loading={loading} />}
        <div className="row my-4">
          <div className="col-md-4 col-12">
            <div className={`card ${styles.card_img_box}`}>
              <div className={` ${styles.cart_img}`}>
                <img
                  src={`${apiUrl}${"/asset/getImages?imageName="}${
                    productAllData?.imageUrl
                  }&pathName=PROPS_IMAGE`}
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
                            onClick={() => setShowModal(true)}
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
              <h4> {productAllData?.modelName}</h4>
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
                              <p>None</p>
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
                              <p>{productAllData?.propId}</p>
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
      <ProceedModal
        showModal={showModal}
        setShowModal={setShowModal}
        proceed={proceed}
        setProceed={setProceed}
        handleApprove={handlePropsApprove}
        handleProceed={handlePropsProceed}
        spineLoading={spineLoading}
      />
      <ToastContainer />
    </>
  );
};

export default page;
