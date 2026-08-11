import { useEffect, useState } from "react";
import styles from "./blogDesign.module.css";
import { useRouter } from "next/navigation";
import { apiUrl } from "../../../environment";
import axios from "axios";
import Head from "next/head";
import Loader from "../../components/loaderDesign/index";
const page = () => {
  const router = useRouter();
  const [blogdata, setBlogdata] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBlogs = async () => {
    setLoading(true);

    const cuskey = [
      {
        blogId: 9,
        key: "rookies meet DEOD your quirky crypto gateway",
      },
      {
        blogId: 10,
        key: "DEOD token going multichain soon",
      },
      {
        blogId: 11,
        key: "discover metaverse journey through digital realms",
      },
      {
        blogId: 12,
        key: "top 5 investment opportunities in decentrawood",
      },
      {
        blogId: 13,
        key: "celebrating diwali in the metaverse",
      },
      {
        blogId: 14,
        key: "cupid hub the future of virtual dating in 2025",
      },
    ];
    try {
      const resp = await axios.get(`${apiUrl}/blog/getAllBlogs`);

      const blogData = resp.data.data;

      // Merge blogData with cuskey based on blogId
      const updatedBlogData = blogData.map((blog) => {
        const matchedKey = cuskey.find((item) => item.blogId === blog.blogId);
        return {
          ...blog,
          key: matchedKey ? matchedKey.key : null, // Add key if found, otherwise null
        };
      });

      setBlogdata(updatedBlogData);
    } catch (error) {
      console.log("errorn in  blog Page");
    }
    setLoading(false);
  };
const openBlog = async (data) => {
  const keysdata = data?.key === null ? data?.title : data?.key;

  const safeSlug = keysdata
    ?.toLowerCase()
    .replace(/\?/g, "")          // 🔥 remove all ? symbols
    .replace(/[^\w\s-]/g, "")    // remove other special chars
    .replace(/\s+/g, "-")        // spaces → dash
    .replace(/-+/g, "-")         // avoid multiple dashes
    .replace(/^-|-$/g, "");      // remove start/end dash

  const finalSlug = `${safeSlug}-${data.blogId}`;

  // console.log("FINAL SLUG:", finalSlug);

  router.push(`/${finalSlug}`);
};
  useEffect(() => {
    getBlogs();
  }, []);
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
      {loading && <Loader />}
      <section className={` ${styles.news_bg}`}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className={` ${styles.live_news_heading}`}>
                <h2>Live Blog</h2>
                <span className={` ${styles.online_light}`}></span>
              </div>
            </div>
          </div>
          <div className="row">
            {blogdata?.map((value, key) => {
              const date = new Date(+value.timestamps);
              const options = {
                year: "numeric",
                month: "short",
                day: "2-digit",
              };

              const formattedDate = date.toLocaleDateString("en-US", options);

              return (
                <div key={key} className="col-12 col-md-4">
                  <div
                    className={`card ${styles.blog_card}`}
                    onClick={() => openBlog(value)}
                  >
                    <div className={styles.blog_card_img_wrapper}>
                      <span className={styles.blog_category_badge}>
                        {value?.title?.toLowerCase().includes("deod") ? "DEOD Token" : "Metaverse"}
                      </span>
                      <img
                        src={`${apiUrl}/asset/getImages?pathName=BLOGS_IMAGE&imageName=${value?.imageUrl[0]}`}
                        alt={value?.title}
                      />
                    </div>

                    <div className={`card-body ${styles.card_bodyblog}`}>
                      <div className="row w-100 m-0 align-items-center">
                        <div className="col-5 p-0">
                          <div className={` ${styles.date_box}`}>
                            <p>{formattedDate}</p>
                          </div>
                        </div>
                        <div className="col-7 p-0">
                          <div className={` ${styles.icon_blog}`}>
                            <div className={`${styles.heart_icon}`}>
                              <i className="fa-solid fa-share-nodes"></i>
                              Share
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
                      <a
                        href={`/${value.blogId}`}
                        onClick={(e) => {
                          e.preventDefault();
                          openBlog(value);
                        }}
                      >
                        Read more <i className="fa-solid fa-arrow-right-long"></i>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
export default page;
