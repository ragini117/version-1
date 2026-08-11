import React, { useEffect, useState } from "react";
import styles from "./profileDesign.module.css";
import { apiUrl } from "../../../../environment";
import ApproveModal from "./ApproveModal";
import { ethers } from "ethers";
import {
  deodAribaContract,
  deodAribaContractAbi,
  deodAribaMarketPlaceContract,
  deodAribaMarketPlaceContractAbi,
  deodNftContract,
  deodNftContractAbi,
  deodNftMarketPlaceContract,
  deodNftMarketPlaceContractAbi,
} from "@/abi/Abi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loader from "../../loaderDesign/index";
const Modal = ({ sellData }) => {
  const router = useRouter();
  const [sellAmount, setSellAmount] = useState(0);
  const [spineLoading, setSpineLoadding] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ExpiredDate, setExpiredDate] = useState(null);
  const [unixExpiredDate, setUnixExpiredDate] = useState(null);

  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 24);

  const [startDate, setStartDate] = useState(currentDate);

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const handleSellNftApprove = async () => {
    setSpineLoadding(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const DEODSellApprove = new ethers.Contract(
        deodNftContract,
        deodNftContractAbi,
        signer
      );
      const txn = await DEODSellApprove.setApprovalForAll(
        deodNftMarketPlaceContract,
        true
      );
      const receipttxn = await txn.wait();
      if (receipttxn.status !== 1) {
        alert("error message");
      } else {
        setProceed(true);
      }
    } catch (error) {
      console.log("sell Aprove error", error);
    }
    setSpineLoadding(false);
  };

  const handleSellNftProceed = async () => {
    setMainLoading(true);
    try {
      let a = ethers.utils.parseUnits(sellAmount, "ether").toString();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const DEODSell = new ethers.Contract(
        deodNftMarketPlaceContract,
        deodNftMarketPlaceContractAbi,
        signer
      );
      const txn = await DEODSell.sellNFTs(
        deodNftContract,
        sellData?.assetsId,
        a,
        unixExpiredDate
      );
      const receipttxn = await txn.wait();
      // const receipttxn = 1
      if (receipttxn.status !== 1) {
        // if (receipttxn !== 1) {
        alert("error message");
      } else {
        const setNewPrice = await DEODSell.getNFTpriceWithTxn(
          deodNftContract,
          sellData?.assetsId
        );
        let setNewPriceInt = ethers.utils.formatEther(setNewPrice);
        const x = ethers.utils.parseUnits(setNewPriceInt, "ether").toString();
        if (!setNewPrice) {
          alert("error message");
        } else {
          await handleSellNFT(sellAmount,receipttxn);
        }
      }
    } catch (error) {
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

  async function handleSellNFT(x,reciept) {
    const formateSellDate = (date) => {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };
    const Data = {
      assetsId: sellData?.assetsId,
      price: x,
      // sellDate: formateSellDate(new Date()),
      expiryDate: ExpiredDate,
      transactionHash:reciept.transactionHash

    };
    await axios
      .post(`${apiUrl}/asset/sellNFT`, Data)
      .then((res) => {
        toast.success("NFT Sell Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push("/marketdashboard");
      })
      .catch((e) => {
        toast.error("Error", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  }

  const handleLandApprove = async () => {
    debugger;
    setSpineLoadding(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const landWearables = new ethers.Contract(
        deodAribaContract,
        deodAribaContractAbi,
        signer
      );
      const setApproval = await landWearables.setApprovalForAll(
        deodAribaMarketPlaceContract,
        true
      );
      const reciept = await setApproval.wait();
      if (reciept.status === 1) {
        setProceed(true);
        toast.success("Approve");
      } else {
        alert("Error");
      }
    } catch (error) {
      console.log(error);
    }

    setSpineLoadding(false);
  };

  const handleLandProceed = async () => {
    setMainLoading(true);
    debugger;
    try {
      let a = ethers.utils.parseUnits(sellAmount, "ether").toString();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const landMarket = new ethers.Contract(
        deodAribaMarketPlaceContract,
        deodAribaMarketPlaceContractAbi,
        signer
      );
      const sellNft = await landMarket.sellNFTs(
        deodAribaContract,
        sellData.assetsId,
        a,
        unixExpiredDate
      );
      const reciept = await sellNft.wait();
      // const reciept = 1
      // if (reciept === 1) {
        if (reciept.status === 1) {
        const setNewPrice = await landMarket.getNFTpriceWithTxn(
          deodAribaContract,
          sellData?.assetsId
        );
        let setNewPriceInt = ethers.utils.formatEther(setNewPrice);
        const x = ethers.utils.parseUnits(setNewPriceInt, "ether").toString();
        const formateSellDate = (date) => {
          return `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
        };
        const payload = {
          assetsId: sellData?.assetsId,
          price: x,
          sellDate: formateSellDate(new Date()),
          expiryDate: ExpiredDate,
          transactionHash:reciept.transactionHash
        };
        const resp = await axios.post(`${apiUrl}asset/sellLandNFT`, payload);
        console.log(resp);
        toast.success("Asset Set on Sale SuccesFully");
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
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

  const handleApproveCity = async () => {
    alert("handleApproveCity");
  };
  const handleProceedCity = async () => {
    alert("handleProceedCity");
  };

  useEffect(() => {
    const timestamp = Math.floor(startDate.getTime() / 1000); // convert to Unix timestamp
    setUnixExpiredDate(timestamp);
    const isoDate = startDate.toISOString();
    setExpiredDate(isoDate);
  }, [startDate]);

  return (
    <>
     {mainLoading && <Loader />}
      {Object.keys(sellData).length !== 0 && (
        <>
          <div
            className="modal fade"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog  modal-lg">
              <div
                className={`modal-content ${styles.cus_modal_content_profile}`}
              >
                <div className="modal-header">
                  <h5 className="modal-title" id="staticBackdropLabel">
                    {sellData?.nameOfNft}
                  </h5>
                  <button
                    type="button"
                    className={`btn-close ${styles.close_btn_profile}`}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <div className="container">
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <div className={` ${styles.profile_pop_main_box}`}>
                          <div className={` ${styles.profile_pop_img}`}>
                            <img
                              src={sellData?.category=='AI_NFT'? `${apiUrl}/asset/getImages?pathName=AI_IMAGE_GENERATION&imageName=${sellData?.image_url}` :`${apiUrl}/asset/getImages?imageName=${sellData?.imageUrl[0]}&pathName=${sellData?.imagePath}`}
                              className="img-fluid"
                              alt=""
                            />
                          </div>
                          <p>{sellData?.description}</p>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className={` ${styles.prfile_data_caption2}`}>
                          <div className={` ${styles.data_rank4box}`}>
                            <p>Purchased</p>
                            <p>{sellData?.buyDate}</p>
                          </div>

                          <div className={`${styles.rank_main_box}`}>
                            {/* <p>Token ID</p> */}
                            <div className={` ${styles.rank_box}`}>
                              <p>#{sellData?.assetsId}</p>
                            </div>
                            <div className={`${styles.data_rankpopupbox}`}>
                              <p></p>
                              <p>Type : {sellData?.category}</p>
                            </div>
                          </div>

                          <div className={`${styles.pop_input_box}`}>
                            <p>DEOD</p>
                            <div className="input-group mb-3">
                              <span
                                className={`input-group-text ${styles.input_logo}`}
                                id="basic-addon1"
                              >
                                <img src="/assets/logoicon.png" alt="" />
                              </span>
                              <input
                                type="number"
                                className={`form-control ${styles.deod_num}`}
                                placeholder="Deod"
                                value={sellAmount}
                                onChange={(e) => setSellAmount(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className={`${styles.pop_input_box}`}>
                            <p>Dollar</p>
                            <div className="input-group mb-3">
                              <span
                                className={`input-group-text ${styles.input_logo2}`}
                                id="basic-addon1"
                              >
                                <img src="/assets/dollar-logo.png" alt="" />
                              </span>
                              <input
                                type="text"
                                className={`form-control ${styles.deod_num}`}
                                value={sellData?.atUsdPrice}
                                disabled
                              />
                            </div>
                          </div>
                          <div className={`${styles.pop_input_box}`}>
                            <p>Expiry Date</p>
                            <div className="input-group mb-3">
                              <DatePicker
                                selected={startDate}
                                className={`form-control ${styles.datebox}`}
                                onChange={(date) => setStartDate(date)}
                                minDate={new Date()}
                                showTimeSelect
                                filterTime={filterPassedTime}
                                dateFormat="dd/MM/yyyy - h:mm aa"
                              />
                            </div>
                          </div>
                          <div className={`${styles.pop_input_box}`}>
                            <div className="input-group mb-3 justify-content-center">
                              {sellData?.onSale ? (
                                <div>
                                  <h5 className="text-danger fw-bold">
                                    Product on sale
                                  </h5>
                                </div>
                              ) : (
                                <>
                                  {sellData?.category == "Land" ||
                                  sellData?.category == "City" ||  sellData?.category == "AI_NFT" ? null : (
                                    <>
                                      <button
                                        className={` w-100  btn btn-primary text-white`}
                                        style={{ backgroundColor: "#7a62f9" }}
                                        onClick={() => setShowModal(true)}
                                      >
                                        <strong> SELL</strong>
                                      </button>
                                    </>
                                  )}
                                </>
                              )}
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
          <ApproveModal
            showModal={showModal}
            setShowModal={setShowModal}
            proceed={proceed}
            setProceed={setProceed}
            handleApprove={
              sellData?.category === "Land"
                ? handleLandApprove
                : sellData?.category === "City"
                ? handleApproveCity
                : handleSellNftApprove
            }
            handleProceed={
              sellData?.category === "Land"
                ? handleLandProceed
                : sellData?.category === "City"
                ? handleProceedCity
                : handleSellNftProceed
            }
            spineLoading={spineLoading}
          />
        </>
      )}
    </>
  );
};

export default Modal;
