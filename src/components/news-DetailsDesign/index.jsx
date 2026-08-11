"use client";
import React, { useEffect, useState } from "react";
import styles from "./news-DetailsDesign.module.css";
import axios from "axios";
import Paginate from "../paginate";
import { baseUrl } from "@/redux/provider";
import NftLoading from "../Loading/nftLoading";
import Head from "next/head";
import { apiUrl } from "../../../environment";
const page = ({info}) => {
    const timestamp = info?.timestamps;
  const date = new Date(+timestamp);
  const options = { year: "numeric", month: "short", day: "2-digit" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return (
    <>
    <Head>
      <title>{info?.title}</title>
      <meta name="description" content={`${info?.title}`}/>
    </Head>

      <section className={` ${styles.news_bg}`}>
        <div className="container">
          <div className="row">
            {info && (
              <div className="col-12">
                <div className={` ${styles.blog_main_box}`}>
                  <div className={` ${styles.blog_img}`}>
                    <img
                      src={`${apiUrl}/asset/getImages?pathName=NEWS_IMAGE&imageName=${info?.imageUrl}`}
                      className="img-fluid"
                      alt="img"
                    />
                  </div>
                  <div className="row my-4">
                    <div className="col-6">
                      <div className={` ${styles.date_box}`}>
                        <p>{formattedDate}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className={` ${styles.icon_blog}`}>
                        <div className={`${styles.heart_icon}`}>
                          share
                          <div className={` ${styles.socail_box_nft}`}>
                            <div className={` ${styles.within_socail_box}`}>
                              <i className="fa-brands fa-linkedin"></i>
                            </div>

                            <div className={` ${styles.within_socail_box}`}>
                              <i className="fa-brands fa-x-twitter"></i>
                            </div>

                            <div className={` ${styles.within_socail_box}`}>
                              <i className="fa-brands fa-facebook"></i>
                            </div>

                            <div className={` ${styles.within_socail_box}`}>
                              <i className="fa-brands fa-instagram"></i>
                            </div>

                            <div className={` ${styles.within_socail_box}`}>
                              <i className="fa-brands fa-youtube"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <div className={` ${styles.blog_caption}`}>
                        <h4>{info?.title}</h4>
                        <div
                          className={styles["left-align"]}
                          dangerouslySetInnerHTML={{
                            __html: info?.description,
                          }}
                        />
                        {/* <p>
                          {" "}
                          In the heart of Decentrawood, where the digital meets
                          the lavish, lies the dazzling Celebrity Villa. This
                          opulent retreat is more than just a destination; it's
                          a virtual haven where glamour and luxury intertwine to
                          create an unforgettable experience.
                        </p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2 */}

            {/* <div className="col-12">
              <div className={` ${styles.blog_main_box}`}>
                <div className={` ${styles.blog_img}`}>
                  <img
                    src="https://backend.decentrawood.com/asset/getImages?pathName=BLOGS_IMAGE&imageName=blog-1705478286562.jpeg"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="row my-4">
                  <div className="col-6">
                    <div className={` ${styles.date_box}`}>
                      <p>Feb 14 2024</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={` ${styles.icon_blog}`}>
                      <div className={`${styles.heart_icon}`}>
                        share
                        <div className={` ${styles.socail_box_nft}`}>
                          <div className={` ${styles.within_socail_box}`}>
                            <i className="fa-brands fa-linkedin"></i>
                          </div>

                          <div className={` ${styles.within_socail_box}`}>
                            <i className="fa-brands fa-x-twitter"></i>
                          </div>

                          <div className={` ${styles.within_socail_box}`}>
                            <i className="fa-brands fa-facebook"></i>
                          </div>

                          <div className={` ${styles.within_socail_box}`}>
                            <i className="fa-brands fa-instagram"></i>
                          </div>

                          <div className={` ${styles.within_socail_box}`}>
                            <i className="fa-brands fa-youtube"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className={` ${styles.blog_caption}`}>
                      <h4>
                        Decentrawood Glamour: A Peek into the Celebrity Villa
                        Extravaganza
                      </h4>
                      <p>
                        {" "}
                        In the heart of Decentrawood, where the digital meets
                        the lavish, lies the dazzling Celebrity Villa. This
                        opulent retreat is more than just a destination; it's a
                        virtual haven where glamour and luxury intertwine to
                        create an unforgettable experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* 3 */}
            {/* <div className="col-12">
              <div className={` ${styles.blog_main_box}`}>
                <div className={` ${styles.blog_img}`}>
                  <img
                    src="https://backend.decentrawood.com/asset/getImages?pathName=BLOGS_IMAGE&imageName=blog-1705478286562.jpeg"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="row my-4">
                  <div className="col-6">
                    <div className={` ${styles.date_box}`}>
                      <p>Feb 14 2024</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={` ${styles.icon_blog}`}>
                      <div className={`${styles.heart_icon}`}>
                        share
                        <div className={` ${styles.socail_box_nft}`}>
                          <div className={` ${styles.within_socail_box}`}>
                            <i className="fa-brands fa-linkedin"></i>
                          </div>

                          <div className={` ${styles.within_socail_box}`}>
                            <i className="fa-brands fa-x-twitter"></i>
                          </div>

                          <div className={` ${styles.within_socail_box}`}>
                            <i className="fa-brands fa-facebook"></i>
                          </div>

                          <div className={` ${styles.within_socail_box}`}>
                            <i className="fa-brands fa-instagram"></i>
                          </div>

                          <div className={` ${styles.within_socail_box}`}>
                            <i className="fa-brands fa-youtube"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className={` ${styles.blog_caption}`}>
                      <h4>
                        Decentrawood Glamour: A Peek into the Celebrity Villa
                        Extravaganza
                      </h4>
                      <p>
                        {" "}
                        In the heart of Decentrawood, where the digital meets
                        the lavish, lies the dazzling Celebrity Villa. This
                        opulent retreat is more than just a destination; it's a
                        virtual haven where glamour and luxury intertwine to
                        create an unforgettable experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* 4/ */}

            {/* <div className="col-12">
              <div className={` ${styles.blog_main_box}`}>
                <div className={` ${styles.blog_img}`}>
                  <img
                    src="https://backend.decentrawood.com/asset/getImages?pathName=BLOGS_IMAGE&imageName=blog-1705478286562.jpeg"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="row my-4">
                  <div className="col-6">
                    <div className={` ${styles.date_box}`}>
                      <p>Feb 14 2024</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={` ${styles.icon_blog}`}>
                      <div className={`${styles.heart_icon}`}>
                        share
                        <div className={` ${styles.socail_box_nft}`}>
                          <div className={` ${styles.within_socail_box}`}>
                            <i className="fa-brands fa-linkedin"></i>
                          </div>

                          <div className={` ${styles.within_socail_box}`}>
                            <i className="fa-brands fa-x-twitter"></i>
                          </div>

                          <div className={` ${styles.within_socail_box}`}>
                            <i className="fa-brands fa-facebook"></i>
                          </div>

                          <div className={` ${styles.within_socail_box}`}>
                            <i className="fa-brands fa-instagram"></i>
                          </div>

                          <div className={` ${styles.within_socail_box}`}>
                            <i className="fa-brands fa-youtube"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className={` ${styles.blog_caption}`}>
                      <h4>
                        Decentrawood Glamour: A Peek into the Celebrity Villa
                        Extravaganza
                      </h4>
                      <p>
                        {" "}
                        In the heart of Decentrawood, where the digital meets
                        the lavish, lies the dazzling Celebrity Villa. This
                        opulent retreat is more than just a destination; it's a
                        virtual haven where glamour and luxury intertwine to
                        create an unforgettable experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
