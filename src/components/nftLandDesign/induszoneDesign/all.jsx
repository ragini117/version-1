"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "../../dashboardLayout/dashbordLayout.module.css";
import Paginate from "../../paginate";
import { ToastContainer, toast } from "react-toastify";
import { baseUrl } from "@/redux/provider";
import "react-toastify/dist/ReactToastify.css";
import NftLoading from "@/components/Loading/nftLoading";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { marketPageAction } from "@/redux/actions/marketPageAction";
import { apiUrl } from "../../../../environment";
const Indusall = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [indusAllData, setindusAllData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const api = `${apiUrl}/city/getAllCity`;
  const handleGetdata = async () => {
    setLoading(true);
    try {
      const res = await axios.get(api);
      if (res.status === 200) {
        setindusAllData(res?.data?.data);
        setPagination(res?.data.pagination);
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
      } else if (error.response.status === 404) {
        const message_404 = error?.response?.data?.message;
        toast.error(message_404, {
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
    setLoading(false);
  };
  const handlePageClick = async (event) => {
    try {
      const resp = await axios.get(
        `${api}${api.includes("?") ? "&" : "?"}page=${event.selected + 1}`
      );
      setindusAllData(resp?.data.data);
      setPagination(resp?.data.pagination);
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
      } else if (error.response.status === 404) {
        const message_404 = error?.response?.data?.message;
        toast.error(message_404, {
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
  };

  const handleProductDetails = (value) => {
    const params = new URLSearchParams();
    params.append("cityId", value?.cityId?.toString());
    params.append("category", value?.category?.toString());
    router.push(`/nftmarketdashboard/land/productdetail?${params.toString()}`);
  };

  const handleaddToCart = (value) => {
    dispatch(marketPageAction(value));
  };

  useEffect(() => {
    handleGetdata();
  }, []);

  return (
    <>
      <div className={`${styles.content}`}>
        {loading && <NftLoading />}
        <div className="container">
          <div className="row g-3">
            <div className="col-12">
              <h5 className={`${styles.title_text}`}>
                {" "}
                Indus Land{" "}
                <span className={`ml-2 p-2 ${styles.total_count}`}>
                  ( {pagination?.totalItems} )
                </span>
              </h5>
            </div>
            {indusAllData?.map((value, key) => {
              return (
                <div className="col-12 col-md-3">
                  <div className={`${styles.card_new}`}>
                    <div className={` ${styles.card_new_img}`}>
                      <img
                        src={`${baseUrl}/asset/getImages?imageName=${value?.imageUrl[0]}&pathName=ASSET_IMAGE_SPIRITUAL_CITY`}
                        alt="land-img"
                      />
                    </div>
                    <div className={`${styles.card_text}`}>
                      <h5>{value?.nameOfNft}</h5>
                      <div className="row">
                        <div className="col-6">
                          <div className={` ${styles.price_box}`}>
                            <img src="/assets/deod.png" alt="" />
                            <p className="text-white">{value?.price}</p>
                          </div>
                          <div className={` ${styles.price_box}`}>
                            <img src="/assets/ether-logo.svg" alt="" />
                            <p className="text-white">{value?.USDprice}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        className={`${styles.buy_button}`}
                        onClick={() => handleProductDetails(value)}
                      >
                        <span>Buy Now</span>
                      </button>
                    </div>
                    <div
                      className={`${styles.cart_new}`}
                      onClick={() => handleaddToCart(value)}
                    >
                      <i className="fa fa-shopping-cart"></i>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* pagenation  */}
        <div className="container">
          <Paginate pagination={pagination} handlePageClick={handlePageClick} />
        </div>
      </div>
    </>
  );
};

export default Indusall;
