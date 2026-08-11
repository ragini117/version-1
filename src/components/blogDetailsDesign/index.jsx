"use client"
import axios from "axios";
import styles from "./blogDetailsDesign.module.css";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiUrl } from "../../../environment";

const page = () => {
  const [info, setInfo] = useState({});
  const { slug } = useParams();
  const router = useRouter();
  const timestamp = info?.timestamps;
  const date = new Date(+timestamp);
  const options = { year: "numeric", month: "short", day: "2-digit" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  const shareUrl = `https://decentrawood.com/${slug}`;

  const getInfo = async (blogId) => {
    try {
      // console.log(blogId)
      const resp = await axios(`${apiUrl}/blog/get/${blogId}`);
      // console.log("blog details", resp.data.findBlog);
      setInfo(resp.data.findBlog);
    } catch (error) {
      console.log(error);
    }
  };
  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    alert("Link copied!");
  };
  useEffect(() => {
    if (!slug) return;
    console.log(slug)
    const slugString = Array.isArray(slug) ? slug.join("-") : slug;

    const blogId = slugString.split("-").pop();

    // console.log("Extracted Blog ID:", blogId);

    if (blogId) {
      getInfo(blogId);
    }
  }, [slug]);
  return (
    <>

      <section className={` ${styles.news_bg}`}>
        <div className="container">
          <div className="row">
            {info && (
              <div className="col-12">
                <div className={` ${styles.blog_main_box}`}>
                  <div className={` ${styles.blog_img}`}>
                    <img
                      src={`${apiUrl}/asset/getImages?pathName=BLOGS_IMAGE&imageName=${info?.imageUrl}`}
                      className="img-fluid"
                      alt={info?.title}
                    />
                  </div>
                  <div className={styles.blog_meta_row}>
                    <div className={styles.date_box}>
                      <p>{formattedDate}</p>
                    </div>
                    <div className={styles.icon_blog}>
                      <div className={styles.share_container}>
                        <span className={styles.share_text}>
                          {/* <i className="fa-solid fa-share-nodes"></i>  */}
                          Share
                        </span>

                        <div className={styles.socail_box_nft}>
                          <div
                            className={styles.within_socail_box}
                            onClick={shareOnLinkedIn}
                          >
                            <i className="fa-brands fa-linkedin-in"></i>
                          </div>

                          <div
                            className={styles.within_socail_box}
                            onClick={shareOnTwitter}
                          >
                            <i className="fa-brands fa-x-twitter"></i>
                          </div>

                          <div
                            className={styles.within_socail_box}
                            onClick={shareOnFacebook}
                          >
                            <i className="fa-brands fa-facebook-f"></i>
                          </div>

                          <div
                            className={styles.within_socail_box}
                            onClick={copyLink}
                          >
                            <i className="fa-solid fa-link"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <div className={`${styles.blog_caption}`}>
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

          </div>
        </div>
      </section>
    </>
  );
};
export default page;
