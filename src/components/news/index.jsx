"use client";
import axios from "axios";
import styles from "../blogDesign/blogDesign.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiUrl } from "../../../environment";
import Loader from "../../components/loaderDesign/index";
import Head from "next/head";
import { slugify } from "../slugify";

const page = () => {
  const [loding, setLoading] = useState(false);
  const router = useRouter();
  const handleNewDetails = (value) => {
    // router.push(`/news/hi`);
    router.push(`/news/${slugify(value.title)}`);
  };

  const [newsdata, setNewsdata] = useState([]);
  const [singleNewsData, setSingleNewsData] = useState();
  const getNews = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${apiUrl}/news/getAllNews`);
      const reversedData = resp?.data?.data.reverse();
      setNewsdata(reversedData);
      setSingleNewsData(resp.data.data[0]);
    } catch (error) {
      console.log("error in  news Page");
    }
    setLoading(false);
  };
  const openNews = async (data) => {
    // console.log(data);
    router.push(`${"/news/news-details"}?newsId=${data.newsId?.toString()}`);
  };
  useEffect(() => {
    getNews();
  }, []);
  // console.log(singleNewsData, "singleNewsData");
  return (
    <>
      <Head>
        <title>
          Decentrawood Blog - Insights on Metaverse, Gaming, and
          Decentralization
        </title>
        <meta
          name="description"
          content={`Stay updated with the latest trends in the metaverse, gaming, and decentralised technologies on the Decentrawood blog. Expert insights, industry news, virtual worlds, NFTs, and more.`}
        />
      </Head>
      {loding && <Loader />}
      <section className={` ${styles.news_bg}`}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className={` ${styles.live_news_heading}`}>
                <h2>Decentrawood News</h2>
                <span className={` ${styles.online_light}`}></span>
              </div>
            </div>
          </div>
          <div className="row">
            {newsdata?.map((value, key) => {
              const date = new Date(+value.timestamps);
              const options = {
                year: "numeric",
                month: "short",
                day: "2-digit",
              };

              const formattedDate = date.toLocaleDateString("en-US", options);

              return (
                <>
                  <div className="col-12 col-md-4" key={key}>
                    <div
                      className={`card ${styles.blog_card}`}
                      onClick={() => handleNewDetails(value)}
                    >
                      <div className={styles.blog_card_img_wrapper}>
                        <span className={styles.blog_category_badge}>News</span>
                        <img
                          src={`${apiUrl}/asset/getImages?pathName=NEWS_IMAGE&imageName=${value?.imageUrl[0]}`}
                          alt={value?.title}
                        />
                      </div>

                      <div className={`card-body ${styles.card_bodyblog}`}>
                        <div className="row">
                          <div className="col-6">
                            <div className={` ${styles.date_box}`}>
                              <p>{formattedDate}</p>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className={` ${styles.icon_blog}`}>
                              <div className={`${styles.heart_icon}`}>
                                <i className="fa-solid fa-share"></i>
                                share
                              </div>

                              <div className={`${styles.heart_icon2}`}>
                                <i className="fa-solid fa-eye"></i>
                                200+
                              </div>
                            </div>
                          </div>
                        </div>
                        <h4 className={styles.blog_card_title}>{value?.title}</h4>
                      </div>
                      <div className={`card-footer ${styles.card_footer_blog}`}>
                        <a href="">
                          Read more <i className="fa-solid fa-arrow-right-long"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
export default page;


