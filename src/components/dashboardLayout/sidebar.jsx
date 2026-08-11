"use client";
import React, { useEffect, useState } from "react";
import styles from "./dashbordLayout.module.css";
import Link from "next/link";
import axios from "axios";
import { apiUrl } from "../../../environment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
const Sidebar = (props) => {
  const { show } = props.data;
  const [activeItem, setActiveItem] = useState(null);
  const router = useRouter()
  const [propsKey, setPropsKey] = useState([]);
  const handleItemClick = (itemId) => {
    setActiveItem(itemId === activeItem ? null : itemId);
  };
  const handleGetPropsData = async () => {
    try {
      const api = `${apiUrl}/props/getAllProps`;
      const resp = await axios.get(api);
      if (resp?.data?.status === true) {
        setPropsKey(resp?.data?.allProps);
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
  };
  useEffect(() => {
    handleGetPropsData();
  }, []);
  // console.log("propsKey", propsKey);

  const handleClick = () => {
    alert("Mayur");
  };
  return (
    <div
      className={show ? `${styles.sidebar} ${styles.sideshow}` : styles.sidebar}
    >
      <div className="p-2 d-md-none d-block">
        <a className={`navbar-brand ${styles.dashboard_logo}`} href="#">
          <img src="/assets/logo.png" alt="" />
        </a>
      </div>
      <ul className={`accordion ${styles.menu_sidebar}`} id="accordionExample">
        <div
          className={`accordion-item ${styles.accordion_cus}`}
          onClick={() => handleItemClick("landingpage")}
        >
          <li
            className={`accordion-button ${
              activeItem === "landingpage"
                ? styles.active
                : styles.accordion_button
            }`}
          >
            {" "}
            <img src="/assets/market-icon.svg" alt="" />
            <img src="/assets/market-icon-active.svg" alt="" />
            <Link href={"/"}>Landing Page</Link>
          </li>
        </div>
        <div
          className={`accordion-item ${styles.accordion_cus}`}
          onClick={() => handleItemClick("marketplace")}
        >
          <li
            className={`accordion-button ${
              activeItem === "marketplace"
                ? styles.active
                : styles.accordion_button
            }`}
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
            id="headingOne"
          >
            {" "}
            <img src="/assets/market-icon.svg" alt="" />
            <img src="/assets/market-icon-active.svg" alt="" />
            <a href="" className="">
              Marketplace
            </a>
          </li>
          <div
            id="collapseOne"
            className={`accordion-collapse collapse`}
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <ul className={`${styles.within_ul}`}>
              <li>
                <Link href="/marketdashboard/nft/all"> All</Link>
              </li>
              <li>
                <Link href="/marketdashboard/nft/digitalart"> NFTs</Link>
              </li>
              {/* <li>
                <a href="">Collectibles</a>
              </li> */}
            </ul>
          </div>
        </div>

        {/* 2 */}

        <div
          className={`accordion-item ${styles.accordion_cus}`}
          onClick={() => handleItemClick("land")}
        >
          <li
            className={`accordion-button ${
              activeItem === "land" ? styles.active : styles.accordion_button
            }`}
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="true"
            aria-controls="collapseTwo"
            id="headingTwo"
          >
            {" "}
            <img src="/assets/map-icon.svg" alt="" />
            <img src="/assets/map-icon-active.svg" alt="" />
            <a href="" className="">
              Land
            </a>
          </li>
          <div
            id="collapseTwo"
            className={`accordion-collapse collapse`}
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <ul className={`${styles.within_ul}`}>
              {/* within_submenu */}
              <ul
                className={`accordion my-0 ${styles.menu_sidebar}`}
                id="accordionExample1"
              >
                <div className={`accordion-item ${styles.accordion_cus}`}>
                  <li
                    className={`accordion-button ${styles.accordion_button}`}
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseZone"
                    aria-expanded="true"
                    aria-controls="collapseZone"
                    id="headingZone"
                  >
                    <a className="">Ariba Zone</a>
                  </li>
                  <div
                    id="collapseZone"
                    className={`accordion-collapse collapse`}
                    aria-labelledby="headingZone"
                    data-bs-parent="#accordionExample1"
                  >
                    <ul className={`${styles.within_ul}`}>
                      <li>
                        <Link href="/marketdashboard/land/aribazone/all">
                          {" "}
                          All
                        </Link>
                      </li>
                      <li>
                        <Link href="/marketdashboard/land/aribazone/mega">
                          Mega
                        </Link>
                      </li>
                      <li>
                        <Link href="/marketdashboard/land/aribazone/large">
                          Large
                        </Link>
                      </li>

                      <li>
                        <Link href="/marketdashboard/land/aribazone/medium">
                          Medium
                        </Link>
                      </li>
                      <li>
                        <Link href="/marketdashboard/land/aribazone/unit">
                          Unit
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* //   2// */}

                <div className={`accordion-item ${styles.accordion_cus}`}>
                  <li
                    className={`accordion-button ${styles.accordion_button}`}
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseZone1"
                    aria-expanded="true"
                    aria-controls="collapseZone1"
                    id="headingZone1"
                  >
                    <a className="">Indus Zone</a>
                  </li>
                  <div
                    id="collapseZone1"
                    className={`accordion-collapse collapse`}
                    aria-labelledby="headingZone1"
                    data-bs-parent="#accordionExample1"
                  >
                    <ul className={`${styles.within_ul}`}>
                      <li>
                        <Link href="/marketdashboard/land/induszone/all">
                          {" "}
                          All
                        </Link>
                      </li>
                      <li>
                        <Link href="/marketdashboard/land/induszone/mega">
                          {" "}
                          Mega
                        </Link>
                      </li>
                      <li>
                        <Link href="/marketdashboard/land/induszone/large">
                          {" "}
                          Large
                        </Link>
                      </li>

                      <li>
                        <Link href="/marketdashboard/land/induszone/medium">
                          {" "}
                          Medium
                        </Link>
                      </li>
                      <li>
                        <Link href="/marketdashboard/land/induszone/unit">
                          {" "}
                          Unit
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </ul>

              {/* submenuend */}
            </ul>
          </div>
        </div>
        {/* end */}
        {/* status */}
        {/* <div
          className={`accordion-item ${styles.accordion_cus}`}
          onClick={() => handleItemClick("landstatus")}
        >
          <li
            className={`accordion-button  ${
              activeItem === "landstatus"
                ? styles.active
                : styles.accordion_button
            }`}
            data-bs-toggle="collapse"
            data-bs-target="#collapsestatus"
            aria-expanded="true"
            aria-controls="collapsestatus"
            id="headingfour"
          >
            {" "}
            <img src="/assets/avatar-icon.svg" alt="" />
            <img src="/assets/avatar-icon-active.svg" alt="" />
            <a href="" className="">
              Land Status
            </a>
          </li>
          <div
            id="collapsestatus"
            className={`accordion-collapse collapse`}
            aria-labelledby="headingstatus"
            data-bs-parent="#accordionExample"
          >
            <ul className={`${styles.within_ul}`}>

              <li className="">
                <input
                  className={`form-check-input mx-2 my-0 ${styles.form_checkinput}`}
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                />
                <label
                  className="form-check-label text-white"
                  htmlFor="flexRadioDefault1"
                >
                  Available to buy
                </label>
              </li>
              <li className="">
                <input
                  className={`form-check-input mx-2 my-0 ${styles.form_checkinput}`}
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  defaultChecked
                />
                <label
                  className="form-check-label text-white"
                  htmlFor="flexRadioDefault2"
                >
                  Available to rent
                </label>
              </li>
            </ul>
          </div>
        </div> */}
        {/* /status */}
        {/* 3 */}
        <div
          className={`accordion-item ${styles.accordion_cus}`}
          onClick={() => handleItemClick("model")}
        >
          <li
            className={`accordion-button ${
              activeItem === "model" ? styles.active : styles.accordion_button
            }`}
            data-bs-toggle="collapse"
            data-bs-target="#collapseThree"
            aria-expanded="true"
            aria-controls="collapseThree"
            id="headingThree"
          >
            {" "}
            <img src="/assets/avatar-icon.svg" alt="" />
            <img src="/assets/avatar-icon-active.svg" alt="" />
            <a href="" className="">
              3D Models
            </a>
          </li>
          <div
            id="collapseThree"
            className={`accordion-collapse collapse`}
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <ul className={`${styles.within_ul}`}>
              <li>
                <Link href="/marketdashboard/model/all"> All</Link>
              </li>
              <li>
                <Link href="/marketdashboard/model/mega"> Mega</Link>
              </li>
              <li>
                <Link href="/marketdashboard/model/large"> Large</Link>
              </li>

              <li>
                <Link href="/marketdashboard/model/medium"> Medium</Link>
              </li>
              <li>
                <Link href="/marketdashboard/model/unit"> Unit</Link>
              </li>
            </ul>
          </div>
        </div>
        {/* 3 */}

        <div
          className={`accordion-item ${styles.accordion_cus}`}
          onClick={() => handleItemClick("avtar")}
        >
          <li
            className={`accordion-button ${
              activeItem === "avtar" ? styles.active : styles.accordion_button
            }`}
            data-bs-toggle="collapse"
            data-bs-target="#collapsefour"
            aria-expanded="true"
            aria-controls="collapsefour"
            id="headingfour"
          >
            {" "}
            <img src="/assets/avatar-icon.svg" alt="" />
            <img src="/assets/avatar-icon-active.svg" alt="" />
            <a href="" className="">
              Props
            </a>
          </li>

          <div
            id="collapsefour"
            className={`accordion-collapse collapse`}
            aria-labelledby="headingfour"
            data-bs-parent="#accordionExample"
          >
            <ul className={`${styles.within_ul}`}>
              {propsKey?.map((value) => {
                return (
                  <li>
                    <Link
                      href={`/marketdashboard/props?modelId=${value?.modelId}`}
                    >
                      {" "}
                      {value?.modelName}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div
          className={`accordion-item ${styles.accordion_cus}`}
          onClick={() => handleItemClick("propsHistory")}
        >
          <li
            className={`accordion-button ${
              activeItem === "propsHistory"
                ? styles.active
                : styles.accordion_button
            }`}
          >
            {" "}
            <img src="/assets/avatar-icon.svg" alt="" />
            <img src="/assets/avatar-icon-active.svg" alt="" />
            <Link href={"/marketdashboard/props-history"}>Props History</Link>
          </li>
        </div>

        <div
          className={`accordion-item ${styles.accordion_cus}`}
          onClick={() => handleItemClick("Gaming")}
        >
          <li
            className={`accordion-button ${
              activeItem === "Gaming" ? styles.active : styles.accordion_button
            }`}
          >
            {" "}
            <img src="/assets/events-icon.svg" alt="" />
            <img src="/assets/events-icon-active.svg" alt="" />
            <Link href={"https://gaming.decentrawood.com"}>Gaming</Link>
          </li>
        </div>
        <div
          className={`accordion-item ${styles.accordion_cus}`}
          onClick={() => handleItemClick("Culture")}
        >
          <li
            className={`accordion-button ${
              activeItem === "Culture" ? styles.active : styles.accordion_button
            }`}
          >
            {" "}
            <img src="/assets/market-icon.svg" alt="" />
            <img src="/assets/market-icon-active.svg" alt="" />
            <Link href={"https://culture.decentrawood.com"}>Culture</Link>
          </li>
        </div>

        <div
          className={`accordion-item ${styles.accordion_cus}`}
          onClick={() => handleItemClick("Glamour")}
        >
          <li
            className={`accordion-button ${
              activeItem === "Glamour" ? styles.active : styles.accordion_button
            }`}
          >
            {" "}
            <img src="/assets/news-icon.svg" alt="" />
            <img src="/assets/news-icon-active.svg" alt="" />
            <Link href={"https://glamour.decentrawood.com"}>Glamour</Link>
          </li>
        </div>

        <div
          className={`accordion-item ${styles.accordion_cus}`}
          onClick={() => router.push("https://ai.decentrawood.com/")}
        >
          <li
            className={`accordion-button ${
              activeItem === "aiImage" ? styles.active : styles.accordion_button
            }`}
          >
            {" "}
            <img src="/assets/avatar-icon.svg" alt="" />
            <img src="/assets/avatar-icon-active.svg" alt="" />
            <Link href={"https://ai.decentrawood.com/"}>AI Image</Link>
          </li>
        </div>
        <div
          className={`accordion-item ${styles.accordion_cus}`}
          onClick={() => router.push("https://ai.decentrawood.com/")}
        >
          <li
            className={`accordion-button  ${
              activeItem === "text-3d" ? styles.active : styles.accordion_button
            }`}
          >
            {" "}
            <img src="/assets/market-icon.svg" alt="" />
            <img src="/assets/market-icon-active.svg" alt="" />
            <Link href={"https://ai.decentrawood.com/"}>AI Text-3D</Link>
          </li>
        </div>
      </ul>
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
