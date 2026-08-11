"use client";
import React, { useEffect, useState } from "react";
import styles from "../../app/page.module.css";
import dynamic from "next/dynamic";
import AOS from "aos";
import "aos/dist/aos.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { useRouter } from "next/navigation";
import { apiUrl, aribaUrl, indusUrl } from "../../../environment";
import heroStyles from "./herosection.module.css"
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";
import axios from "axios";

if (typeof window !== "undefined") {
  const $ = require("jquery");
  if (!$.camelCase) {
    $.camelCase = function (string) {
      return string.replace(/-([a-z])/g, function (all, letter) {
        return letter.toUpperCase();
      });
    };
  }
  if (!$.type) {
    $.type = function (obj) {
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

const features = [
  {
    id: 1,
    title: "Global Markets Rally",
    image: "/news1.png", // add your images in /public
    tags: ["NEWS", "LATEST"],
    description: "Stocks surge as investors react to positive economic data.",
  },
  {
    id: 2,
    title: "Tech Giants Announce Partnership",
    image: "/news2.png",
    tags: ["NEWS", "TECH"],
    description: "Major companies team up to drive innovation in AI research.",
  },
  {
    id: 3,
    title: "Climate Summit 2025",
    image: "/news3.png",
    tags: ["NEWS", "WORLD"],
    description: "Leaders discuss urgent actions to combat global warming.",
  },
  {
    id: 4,
    title: "Breakthrough in Medicine",
    image: "/news4.png",
    tags: ["NEWS", "HEALTH"],
    description: "New treatment shows promising results in clinical trials.",
  },
  {
    id: 5,
    title: "Sports Championship Highlights",
    image: "/news5.png",
    tags: ["NEWS", "SPORTS"],
    description: "Underdog team secures a thrilling victory in the finals.",
  },
  {
    id: 6,
    title: "Space Mission Success",
    image: "/news6.png",
    tags: ["NEWS", "SCIENCE"],
    description: "Space agency celebrates after probe lands on distant moon.",
  },
];


const landingPages = [{
  id: 1,
  image: "/assets/video/original.gif",
  title: "Gaming",
  href: "https://gaming.decentrawood.com/",
  alt: "Explore AI-powered Web3 gaming experiences and immersive digital entertainment in Decentrawood."
},
{
  id: 2,
  image: "/assets/video/original1.gif",
  title: "AI",
  href: "https://ai.decentrawood.com/",
  alt: "Discover AI-driven tools, automation, and intelligent digital experiences in the Decentrawood ecosystem."
},
{
  id: 3,
  image: "/assets/metaversegif.gif",
  title: "Metaverse",
  href: "https://glamour.decentrawood.com",
  alt: "Experience the Decentrawood metaverse with immersive virtual reality and interactive digital worlds"
},
];
const Index = () => {
  const router = useRouter();
  const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
  });


  const [marketLink, setMarketLink] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const options = {
    loop: true,
    margin: 10,
    nav: false,
    dots: false,
    autoplay: true,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 },
    },
  };

  const options2 = {
    loop: true,
    margin: 20,
    nav: false,
    dots: false,
    autoplay: true,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 2 },
    },
  };

  const options3 = {
    loop: false,
    margin: 10,
    nav: false,
    dots: false,
    autoplay: false,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 },
    },
  };

  const communityContents = [
    {
      id: 1,
      title: "Register & Invite",
      description:
        "Sign up through a referral and bring more people to grow the community. The more referrals you bring, the bigger your rewards.",
      icon: "/assets/add-friend.png",
      alt: "Sign up and join the Decentrawood community to access Web3 experiences and rewards."
    },
    {
      id: 2,
      title: "Promote & Win",
      description:
        "Spread the word on social media using hashtags like #Decentrawood and #PlayToEarn. More engagement = more rewards.",
      icon: "/assets/megaphone (1).png",
      alt: "Promote Decentrawood through social campaigns and stay updated with community announcements."
    },
    {
      id: 3,
      title: "Get Incentives",
      description:
        "Earn exclusive NFT drops, token bonuses, and leaderboard rewards by contributing to discussions and helping newcomers.",
      icon: "/assets/incentive.png",
      alt: "Earn rewards, NFT incentives, and token benefits through participation in the Decentrawood ecosystem."
    },
  ];


  const handleStartExploring = () => {
    router.push("/connectwallet");
  };
  const [newsdata, setNewsdata] = useState([]);
  // const [singleNewsData, setSingleNewsData] = useState();
  const getNews = async () => {
    // setLoading(true);
    try {
      const resp = await axios.get(`${apiUrl}/news/getAllNews`);
      const reversedData = resp?.data?.data.reverse();
      setNewsdata(reversedData);
      // setSingleNewsData(resp.data.data[0]);
    } catch (error) {
      console.log("error in  news Page");
    }
    // setLoading(false);
  };
  // const openNews = async (data) => {
  //   console.log(data);
  //   router.push(`${"/news/news-details"}?newsId=${data.newsId?.toString()}`);
  // };
  useEffect(() => {
    getNews();
  }, []);
  // console.log(newsdata, "singleNewsData");
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });
  }, []);
  return (
    <>
      {/* section */}
      <section className={heroStyles.heroSection}>
        {/* Banner */}
        <div className={heroStyles.heroBanner}>
          {/* High-tech Web3 Background elements */}
          <div className={heroStyles.gridOverlay}></div>
          <div className={heroStyles.glowBlob1}></div>
          <div className={heroStyles.glowBlob2}></div>

          <div className={heroStyles.heroContent}>
            {/* Top Glass Badge */}
            {/* <div className={heroStyles.heroBadge} data-aos="fade-down">
        <span className={heroStyles.badgeText}>Next-Gen Web3 Platform</span>
      </div> */}

            <h1 className={heroStyles.heroTitle} data-aos="fade-up">
              Trendsetter in <span className={heroStyles.gradientText}>Web3 Entertainment</span>
              <span className={heroStyles.subTitle}>AI Powered & Fully Immersive</span>
            </h1>

            <p className={heroStyles.heroDescription} data-aos="fade-up" data-aos-delay="100">
              Step into a decentralized universe where gaming, artificial intelligence, and virtual world creation converge into a seamless ecosystem.
            </p>

            <div className={heroStyles.heroBtnGroup} data-aos="fade-up" data-aos-delay="200">
              <a href="https://gaming.decentrawood.com/" target="_blank" rel="noopener noreferrer" className={heroStyles.heroBtnSecondary}>
                Explore Gaming
              </a>
            </div>
          </div>
        </div>
      </section>



      <section className={heroStyles.landingSection}>
        <div className={heroStyles.grid}>
          {landingPages.map((page) => (
            <a
              key={page.id}
              href={page.href}   // fallback if no href is given
              target="_blank"           // open in new tab
              rel="noopener noreferrer" // security best practice
              className={heroStyles.cardLink}
            >
              <div className={heroStyles.landingCard}>
                <div className={heroStyles.imageWrapper}>
                  <img
                    src={page.image}
                    alt={page.alt}
                    width={200}
                    height={200}
                  />
                </div>
                <p className={heroStyles.title}>{page.title}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ARBITRAGE BANNER */}
      <section className={heroStyles.arbitrageBanner}>
        <div className={heroStyles.arbBannerContent}>
          <div className={heroStyles.arbBannerText}>
            <h2>Trade Smarter: DEOD Arbitrage Opportunity</h2>
            <p>Capture price differences across MEXC, Bitmart, Toobit, and PancakeSwap.</p>
          </div>
          <button className={heroStyles.ctaPrimary} onClick={() => router.push("/trade")}>
            Learn More
          </button>
        </div>
      </section>

      <section className={heroStyles.featureSection} >
        <h2 className={heroStyles.featureHeading}>News & Events</h2>

        <Swiper modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={3}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000, // 3 sec halt on each slide 
            disableOnInteraction: false, pauseOnMouseEnter: true,
          }}
          speed={1000} // 1s smooth sliding animation
          loop={true}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 },
          }} >
          {newsdata.map((feature) => (<SwiperSlide key={feature.id}>
            <div className={heroStyles.newsCard} data-aos="fade-up" onClick={() => router.push("/news")}>
              <div className={heroStyles.imageWrapper}>
                <img src={`${apiUrl}/asset/getImages?pathName=NEWS_IMAGE&imageName=${feature?.imageUrl[0]}`} alt={feature.title} />
                <div className={heroStyles.overlay}>
                  {/* <p>{feature.title}</p> */}
                </div>
              </div>
              <div className={heroStyles.cardFooter}>
                <div className={heroStyles.tags}>
                  {["NEWS"].map((tag, index) => (<span key={index}
                    className={heroStyles.tag}>
                    <p>{feature.title}</p>

                  </span>))}
                </div>
                {/* <p className={heroStyles.description}>
    {feature.description}</p> */}
              </div>
            </div>
          </SwiperSlide>))}
        </Swiper>
      </section>


      <section className={heroStyles.communitySection}>
        <h2 className={heroStyles.communityHeading}>Join Our Community</h2>
        <p className={heroStyles.communitySubheading}>
          Engage, share, and grow with Decentrawood.
        </p>

        <div className={heroStyles.communityGrid}>
          {communityContents.map((item) => (
            <div
              key={item.id}
              className={heroStyles.communityCard}
              onClick={() => router.push("/connectwallet")}
              style={{ cursor: "pointer" }} // show pointer on hover
            >
              <div className={heroStyles.communityIconWrapper}>
                <img src={item.icon} alt={item.alt} />
              </div>
              <h3 className={heroStyles.communityTitle}>{item.title}</h3>
              <p className={heroStyles.communityDescription}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className={heroStyles.ctaWrapper}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className={heroStyles.backgroundVideo}
        >
          <source src="/assets/video/download.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <section className={heroStyles.ctaSection}>
          <div className={heroStyles.ctaContent}>
            <h2 className={heroStyles.ctaHeading}>Be Part of the Future</h2>
            <p className={heroStyles.ctaSubheading}>
              Join Decentrawood today and unlock exclusive rewards, events, and
              early access to new features.
            </p>
            <div className={heroStyles.ctaButtons}>
              <button className={heroStyles.ctaPrimary} onClick={() => {
                marketLink
                  ? router.push("/marketdashboard")
                  : router.push("/nftmarketdashboard");
              }}>Marketplace</button>
              <button className={heroStyles.ctaSecondary} onClick={() => {
                router.push("/connectwallet");
              }}>Join Now</button>
            </div>
          </div>
        </section>
      </div>


    </>
  );
};

export default Index;
