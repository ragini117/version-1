import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../dashboardLayout/dashbordLayout.module.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import dynamic from "next/dynamic";
import { baseUrl } from "@/redux/provider";
import "../../app/globals.css";
import Link from "next/link";
import Loader from "../loaderDesign/index";
import { useRouter } from "next/navigation";
// import bannerVideo from "../../../public/assets/banner-video.mp4";
import { toast } from "react-toastify";

if (typeof window !== "undefined") {
    const $ = require("jquery");
    if (!$.camelCase) {
        $.camelCase = function(string) {
            return string.replace(/-([a-z])/g, function(all, letter) {
                return letter.toUpperCase();
            });
        };
    }
    if (!$.type) {
        $.type = function(obj) {
            if (obj == null) {
                return String(obj);
            }
            return typeof obj === "object" || typeof obj === "function"
                ? Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
                : typeof obj;
        };
    }
    window.$ = window.jQuery = $;
}
const index = () => {
    const router = useRouter();
    const [nftData, setNftData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aribaAllData, setAribaAllData] = useState([]);
    const [indusAllData, setIndusAllData] = useState([]);
    const [modelAllData, setModelAllData] = useState([]);
    const api = "/asset/get-userAssets";
    const aribaApi = "/asset/getUserLandAssets";
    const indusApi = "/city/getAllCity";
    const threeDmodelapi = "/asset/getAllUserModels";

    const handleNftdata = async () => {
        try {
            const res = await axios.get(api);
            // console.log("resNft >>>>>", res);
            if (res.status === 200) {
                setNftData(res?.data?.results);
                setPagination(res?.data.pagination);
            }
        } catch (error) {
            if (error?.response?.status === 400) {
                const message_400 = error?.response?.data?.message;
                toast.error(message_400, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            if (error?.response?.status === 401) {
                const message_401 = error?.response?.data?.message;
                toast.error(message_401, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            if (error?.response?.status === 404) {
                const message_404 = error?.response?.data?.message;
                toast.error(message_404, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            if (error?.response?.status === 500) {
                const message_500 = error?.response?.data?.message;
                toast.error(message_500, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }
    };

    const handleAribaLand = async () => {
        try {
            const res = await axios.get(aribaApi);
            // console.log("resAriba >>>>>", res);
            if (res.status === 200) {
                setAribaAllData(res?.data?.data);
                // setPagination(res?.data.pagination);
            }
        } catch (error) {
            if (error?.response?.status === 400) {
                const message_400 = error?.response?.data?.message;
                toast.error(message_400, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            if (error?.response?.status === 401) {
                const message_401 = error?.response?.data?.message;
                toast.error(message_401, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            if (error?.response?.status === 404) {
                const message_404 = error?.response?.data?.message;
                toast.error(message_404, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            if (error?.response?.status === 500) {
                const message_500 = error?.response?.data?.message;
                toast.error(message_500, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }
    };

    const handleIndusZone = async () => {
        try {
            const res = await axios.get(indusApi);
            // console.log("resIndus >>>>>>", res);
            if (res.status === 200) {
                setIndusAllData(res?.data?.data);
                // setPagination(res?.data.pagination);
            }
        } catch (error) {
            if (error?.response?.status === 400) {
                const message_400 = error?.response?.data?.message;
                toast.error(message_400, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            if (error?.response?.status === 401) {
                const message_401 = error?.response?.data?.message;
                toast.error(message_401, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            if (error?.response?.status === 404) {
                const message_404 = error?.response?.data?.message;
                toast.error(message_404, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            if (error?.response?.status === 500) {
                const message_500 = error?.response?.data?.message;
                toast.error(message_500, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }
    };

    const handleThreedmodel = async () => {
        try {
            const res = await axios.get(threeDmodelapi);
            console.log("threeDmodelapi", res);
            if (res.status === 200) {
                setModelAllData(res?.data?.data);
                // setPagination(res?.data.pagination);
            }
        } catch (error) {
            if (error?.response?.status === 400) {
                const message_400 = error?.response?.data?.message;
                toast.error(message_400, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            if (error?.response?.status === 401) {
                const message_401 = error?.response?.data?.message;
                toast.error(message_401, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            if (error?.response?.status === 404) {
                const message_404 = error?.response?.data?.message;
                toast.error(message_404, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            if (error?.response?.status === 500) {
                const message_500 = error?.response?.data?.message;
                toast.error(message_500, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            await Promise.all([
                handleNftdata(),
                handleAribaLand(),
                handleIndusZone(),
                handleThreedmodel(),
            ]);
            setLoading(false);
        };
        fetchAllData();
    }, []);

    const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
        ssr: false,
        loading: () => <p>Loading...</p>,
    });

    const options = {
        loop: true,
        margin: 10,
        nav: true,
        dots: false,
        autoplay: false,
        responsive: {
            0: { items: 1 },
            600: { items: 1 },
            1000: { items: 4 },
        },
    };

    return (
        <>
            {loading && <Loader />}
            <div className={`${styles.content}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className={`${styles.banner_box}`}>
                                <img
                                    src="./assets/Decentrawood_1412x130.png"
                                    className="img-fluid "
                                />
                                <button
                                    className={`btn shadow-none ${styles.button_1}`}
                                    onClick={() => {
                                        router.push("/metawallet");
                                    }}
                                >
                                    Join Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container ">
                    <div className="row my-4">
                        <div className="col-12">
                            <div className={`${styles.heading_dasdhboard}`}>
                                <h2>
                                    Welcome to the Decentrawood NFT Marketplace
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center my-5">
                        <div className="col-md-2 col-6">
                            <div
                                className={` ${styles.tab_dashboard1}`}
                                onClick={() => router.push(`./playasguest`)}
                            >
                                <p>PLAY AS GUEST</p>
                                <img
                                    src="./assets/CollectionPacks.png"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div
                            className="col-md-2 col-6"
                            onClick={() => alert("Coming soon")}
                        >
                            <div className={` ${styles.tab_dashboard2}`}>
                                <p>AVATAR</p>
                                <img src="./assets/Avatar.png" alt="" />
                            </div>
                        </div>
                        <div
                            className="col-md-2 col-6"
                            onClick={() => alert("Coming soon")}
                        >
                            <div className={` ${styles.tab_dashboard3}`}>
                                <p>ENTITY</p>
                                <img src="./assets/Entity.png" alt="" />
                            </div>
                        </div>
                        <div
                            className="col-md-2 col-6"
                            onClick={() => alert("Coming soon")}
                        >
                            <div className={` ${styles.tab_dashboard4}`}>
                                <p>EQUIPMENT</p>
                                <img src="./assets/Equipment.png" alt="" />
                            </div>
                        </div>
                        <div className="col-md-2 col-6">
                            <div
                                className={` ${styles.tab_dashboard5}`}
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal3"
                            >
                                <p>LAND MAP</p>
                                <img src="./assets/Land.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`container ${styles.cus_dashbordcontainer}`}>
                    <div className="row my-4">
                        <div className="col-6">
                            <div className={` ${styles.title_box}`}>
                                {/* <p> (100)</p> */}
                                <p>
                                    Digital Art <span>(100)</span>
                                </p>
                            </div>
                        </div>
                        <div className="col-6">
                            <Link href="/marketdashboard/nft/all">
                                <div className={` ${styles.title_box2}`}>
                                    <p>
                                        Explore All{" "}
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* =========================== */}
                    <div className="container">
                        <OwlCarousel
                            className={`owl-theme ${styles.nft_carousel}`}
                            {...options}
                        >
                            {nftData?.map((value, key) => {
                                return (
                                    <div className={`card ${styles.new_card}`}>
                                        <div className={`${styles.nft_img}`}>
                                            <img
                                                src={`${baseUrl}/asset/getImages?imageName=${value?.imageUrl[0]}&pathName=ASSET_IMAGE_PATH_NFT`}
                                                alt="000"
                                            />
                                        </div>
                                        <div
                                            className={`${styles.nft_avt_img}`}
                                        >
                                            <img
                                                src="./assets/nft_logo.png"
                                                alt="000"
                                            />
                                        </div>
                                        <div className="card-body">
                                            <div
                                                className={`${styles.title_nft}`}
                                            >
                                                <img
                                                    src="./assets/bluetick.png"
                                                    alt=""
                                                />
                                                <div
                                                    className={` ${styles.nft_title2}`}
                                                >
                                                    <p>{value?.nameOfNft}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <div
                                                        className={` ${styles.price_box_new}`}
                                                    >
                                                        <p>{value?.price}</p>
                                                        <div
                                                            className={` ${styles.usdprice}`}
                                                        >
                                                            <p>
                                                                {
                                                                    value?.USDprice
                                                                }{" "}
                                                            </p>{" "}
                                                            <span>USD</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div
                                                        className={` ${styles.cart_box_new}`}
                                                    >
                                                        <i className="fa-solid fa-cart-shopping"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </OwlCarousel>
                    </div>

                    {/* ===============modal============ my */}
                    <div className="row my-4">
                        <div className="col-6">
                            <div className={` ${styles.title_box}`}>
                                <p>
                                    Model <span>(100)</span>
                                </p>
                            </div>
                        </div>
                        <div className="col-6">
                            <Link href="/marketdashboard/nft/all">
                                <div className={` ${styles.title_box2}`}>
                                    <p>
                                        Explore All{" "}
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* =========================== */}
                    <div className="container">
                        <OwlCarousel
                            className={`owl-theme ${styles.nft_carousel}`}
                            {...options}
                        >
                            {modelAllData?.map((value, key) => {
                                return (
                                    <div className={`card ${styles.new_card}`}>
                                        <div className={`${styles.nft_img}`}>
                                            <img
                                                src={`${baseUrl}/asset/getImages?imageName=${value?.imageUrl[0]}&pathName=ASSET_IMAGE_DEWOODMODELS`}
                                                alt="000"
                                            />
                                        </div>
                                        <div
                                            className={`${styles.nft_avt_img}`}
                                        >
                                            <img
                                                src="./assets/nft_logo.png"
                                                alt="000"
                                            />
                                        </div>
                                        <div className="card-body">
                                            <div
                                                className={`${styles.title_nft}`}
                                            >
                                                <img
                                                    src="./assets/bluetick.png"
                                                    alt=""
                                                />
                                                <div
                                                    className={` ${styles.nft_title2}`}
                                                >
                                                    <p>{value?.modelName}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <div
                                                        className={` ${styles.price_box_new}`}
                                                    >
                                                        <p>{value?.price}</p>
                                                        <div
                                                            className={` ${styles.usdprice}`}
                                                        >
                                                            <p>
                                                                {
                                                                    value?.USDprice
                                                                }{" "}
                                                            </p>{" "}
                                                            <span>USD</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div
                                                        className={` ${styles.cart_box_new}`}
                                                    >
                                                        <i className="fa-solid fa-cart-shopping"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </OwlCarousel>
                    </div>

                    {/* end my modal ============================*/}

                    {/* model land */}

                    {/* <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between mb-4">
                <h5 className={`${styles.title_text}`}>3D Models</h5>
                <div className={`${styles.link}`}>
                  <Link href="#">
                    Explore Collectible Packs{" "}
                    <i className="bi bi-arrow-right-circle-fill"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-12">
              <OwlCarousel className="owl-theme" {...options}>
                {modelAllData?.map((value, key) => {
                  return (
                    <div className={`card ${styles.card_nft}`}>
                      <div className={` ${styles.card_nft_img}`}>
                        <img
                          src={`${baseUrl}/asset/getImages?imageName=${value?.imageUrl[0]}&pathName=ASSET_IMAGE_DEWOODMODELS`}
                          alt=""
                        />
                      </div>
                      <div className="card-body">
                        <div className={`${styles.nft_title}`}>
                          <p>{value?.nameOfNft}</p>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <div className={` ${styles.price_box}`}>
                              <img src="/assets/deod.png" alt="" />
                              <p>{value?.price}</p>
                            </div>
                            <div className={` ${styles.price_box}`}>
                              <img src="/assets/ether-logo.svg" alt="" />
                              <p>{value?.price}</p>
                            </div>
                          </div>
                          <div className={`col-6`}>
                            <div className={`${styles.cart_icon_box2}`}>
                              <a href="">
                                <i className="bi bi-cart3"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </OwlCarousel>
            </div>
          </div> */}

                    {/* ariba land */}

                    {/* <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between mb-4">
                <h5 className={`${styles.title_text}`}>Ariba Zone</h5>
                <div className={`${styles.link}`}>
                  <Link href="#">
                    Explore Collectible Packs{" "}
                    <i className="bi bi-arrow-right-circle-fill"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-12">
              <OwlCarousel className="owl-theme" {...options}>
                {aribaAllData?.map((value, key) => {
                  return (
                    <div className={`card ${styles.card_nft}`}>
                      <div className={` ${styles.card_nft_img}`}>
                        <img
                          src={`${baseUrl}/asset/getImages?imageName=${value?.imageUrl[0]}&pathName=ASSET_IMAGE_PATH`}
                          alt=""
                        />
                      </div>
                      <div className="card-body">
                        <div className={`${styles.nft_title}`}>
                          <p>{value?.nameOfNft}</p>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <div className={` ${styles.price_box}`}>
                              <img src="/assets/deod.png" alt="" />
                              <p>{value?.price}</p>
                            </div>
                            <div className={` ${styles.price_box}`}>
                              <img src="/assets/ether-logo.svg" alt="" />
                              <p>{value?.price}</p>
                            </div>
                          </div>
                          <div className={`col-6`}>
                            <div className={`${styles.cart_icon_box2}`}>
                              <a href="">
                                <i className="bi bi-cart3"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </OwlCarousel>
            </div>
          </div> */}

                    {/* indus land */}

                    {/* <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between mb-4">
                <h5 className={`${styles.title_text}`}>Indus Zone </h5>
                <div className={`${styles.link}`}>
                  <Link href="#">
                    Explore Collectible Packs{" "}
                    <i className="bi bi-arrow-right-circle-fill"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-12">
              <OwlCarousel className="owl-theme" {...options}>
                {indusAllData?.map((value, key) => {
                  return (
                    <div className={`card ${styles.card_nft}`}>
                      <div className={` ${styles.card_nft_img}`}>
                        <img
                          src={`${baseUrl}/asset/getImages?imageName=${value?.imageUrl[0]}&pathName=ASSET_IMAGE_SPIRITUAL_CITY`}
                          alt=""
                        />
                      </div>
                      <div className="card-body">
                        <div className={`${styles.nft_title}`}>
                          <p>{value?.nameOfNft}</p>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <div className={` ${styles.price_box}`}>
                              <img src="/assets/deod.png" alt="" />
                              <p>{value?.price}</p>
                            </div>
                            <div className={` ${styles.price_box}`}>
                              <img src="/assets/ether-logo.svg" alt="" />
                              <p>{value?.price}</p>
                            </div>
                          </div>
                          <div className={`col-6`}>
                            <div className={`${styles.cart_icon_box2}`}>
                              <a href="">
                                <i className="bi bi-cart3"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </OwlCarousel>
            </div>
          </div> */}
                </div>

                {/* decentrawood Map modal */}
                <div
                    className="modal fade"
                    id="exampleModal3"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel3"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className={`modal-content ${styles.map_content}`}>
                            <div className="modal-header border-0">
                                <h5
                                    className="modal-title"
                                    id="exampleModalLabel"
                                ></h5>
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
                                    <div className="col-6 col-md-6 text-center">
                                        <div
                                            className={` ${styles.map_img_box}`}
                                        >
                                            <div
                                                className={` ${styles.map_img}`}
                                            >
                                                <img
                                                    src="/assets/ariba.png"
                                                    className="img-fluid"
                                                    alt=""
                                                />
                                            </div>
                                            <button
                                                className={` ${styles.map_btn}`}
                                                data-bs-dismiss="modal"
                                                onClick={() =>
                                                    window.open(
                                                        aribaUrl,
                                                        "_blank",
                                                    )
                                                }
                                            >
                                                Ariba zone
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 text-center">
                                        <div
                                            className={` ${styles.map_img_box}`}
                                        >
                                            <div
                                                className={` ${styles.map_img}`}
                                            >
                                                <img
                                                    src="/assets/spiritual.png"
                                                    className="img-fluid"
                                                    alt=""
                                                />
                                            </div>
                                            <button
                                                className={` ${styles.map_btn}`}
                                                data-bs-dismiss="modal"
                                                onClick={() =>
                                                    window.open(
                                                        indusUrl,
                                                        "_blank",
                                                    )
                                                }
                                            >
                                                Indus zone
                                            </button>
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

export default index;
