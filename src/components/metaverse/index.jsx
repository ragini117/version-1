"use client";
import React, {useState,useEffect} from 'react'
import metaStyles from "./meta.module.css"
const Metaversection = () => {

   const cards = [
  { title: "Friends", img: "/assets/metaverseeee/Untitleddesign/1.png" },
  { title: "Coffee", img: "/assets/metaverseeee/Untitleddesign/2.png" },
  { title: "Clubbing", img: "/assets/metaverseeee/Untitleddesign/3.png" },
  { title: "Parties", img: "/assets/metaverseeee/Untitleddesign/4.png" },
  { title: "Hangouts", img: "/assets/metaverseeee/Untitleddesign/5.png" },
];

  const items = [
    { text: "Celebrities", img: "/assets/Glamour images/Celebrity palace.png", rotation: -20 },
    { text: "Fashion Shows", img: "/assets/Glamour images/cupid hub.png", rotation: -10 },
    { text: "Events", img: "/assets/Glamour images/Marriage hall.png", rotation: 0 },
    { text: "Luxury Clubs", img: "/assets/Glamour images/Villa.png", rotation: 10 },
    { text: "Exclusive Meetups", img: "/assets/Glamour images/Restaurant.png", rotation: 20 },
  ];

const videos = [
  {
    id: 1,
    src: "/assets/video/Gamingvideo.m4v",
    title: "Gaming",
  },
  {
    id: 2,
    src: "/assets/video/Glamourvideo.m4v",
    title: "Glamour",
  },
  {
    id: 3,
    src: "/assets/video/Culturevideo.m4v",
    title: "Culture",
  },
];
const cultureZoneCards = [
    {
      text: "Festivals",
      img: "/assets/culture images/Khatushyam baba.png",
      // desc: "Celebrating the colors and rhythms of culture.",
    },
    {
      text: "People",
      img: "/assets/culture images/decentrawoodcharaja.png",
      // desc: "Stories of communities and connections.",
    },
    {
      text: "Places",
      img: "/assets/culture images/Red Fort.png",
      // desc: "Landscapes that define our shared heritage.",
    },
  ];




 const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % videos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % videos.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + videos.length) % videos.length);


  return (
<div>
  <section className={metaStyles.metaverseSection}>
      <div className={metaStyles.textBlock}>
        <h2 className={metaStyles.heading}>
          Step into a world where <span>AI meets imagination.</span>
        </h2>
        <p className={metaStyles.subtext}>
          Our Metaverse is built on three vibrant zones, each offering unique
          experiences and opportunities for creators, gamers, and explorers.
        </p>
      </div>

      <div className={metaStyles.videoStage}>
        {videos.map((video, index) => {
          let position = "";
          if (index === current) position = metaStyles.active;
          else if (index === (current - 1 + videos.length) % videos.length)
            position = metaStyles.prev;
          else if (index === (current + 1) % videos.length)
            position = metaStyles.next;
          else position = metaStyles.hidden;

          return (
            <div key={video.id} className={`${metaStyles.videoWrapper} ${position}`}>
              <video
                src={video.src}
                className={metaStyles.video}
                autoPlay
                loop
                muted
              />
              <div className={metaStyles.caption}>
                <h3>{video.title}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className={metaStyles.controls}>
        <button onClick={prevSlide} className={metaStyles.arrow}>
          ◀
        </button>
        <div className={metaStyles.dots}>
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`${metaStyles.dot} ${
                index === current ? metaStyles.activeDot : ""
              }`}
            ></button>
          ))}
        </div>
        <button onClick={nextSlide} className={metaStyles.arrow}>
          ▶
        </button>
      </div>
    </section>


         <section className={metaStyles.socialZoneWrapper}>
      <div className={metaStyles.socialZoneTextBlock}>
  <h2 className={metaStyles.socialZoneHeading}>
    Social <span>Zone</span>
  </h2>
  <p className={metaStyles.socialZoneSubtext}>Where connections come alive</p>
</div>

      <div
        className={metaStyles.socialZoneCarousel}
        style={{ "--card-count": cards.length }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className={metaStyles.socialZoneCard}
            style={{
              "--card-index": index,
              "--card-color": "168, 85, 247",
            }}
          >
            <div
              className={metaStyles.socialZoneImage}
              style={{ backgroundImage: `url(${card.img})` }}
            >
              <div className={metaStyles.socialZoneOverlay}>
                <h3>{card.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className={metaStyles.socialZone__description}>The Social Zone is your digital lifestyle hub — meet, chat, and share experiences just like in real life.</p>
    </section>

    

       <section className={metaStyles.glamourZone__section}>
      <h2 className={metaStyles.socialZoneHeading}> Glamour <span> Zone </span></h2>
      <p className={metaStyles.glamourZone__subtitle}>Where style meets stardom.</p>

      <div className={metaStyles.glamourZone__container}>
        {items.map((item, index) => (
          <div
            key={index}
            className={metaStyles.glamourZone__glass}
            style={{ "--r": item.rotation + "deg" }}
            data-text={item.text}
          >
            <img
              src={item.img}
              alt={item.text}
              className={metaStyles.glamourZone__image}
            />
          </div>
        ))}
      </div>

      <p className={metaStyles.glamourZone__description}>
        The Glamour Zone is home to the <strong>Ariba Zone</strong>, bringing
        glitz, fame, and entertainment into the metaverse.
      </p>


      <div className={metaStyles.buttonWrapper}>
      <button className={metaStyles.button} onClick={() => window.location.href = "https://glamour.decentrawood.com/"}>
      <span>Glamour Zone</span>
      <div className={metaStyles.iconWrapper} >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 74 74"
          height="24"
          width="24"
        >
          <circle
            strokeWidth="3"
            stroke="white"
            fill="black"
            r="35.5"
            cy="37"
            cx="37"
          ></circle>
          <path
            fill="white"
            d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
          ></path>
        </svg>
      </div>
    </button>
  </div>
    </section>

 <section className={metaStyles.cultureZone__section}>
      <h2 className={metaStyles.socialZoneHeading}> Culture <span> Zone </span> </h2>
      <p className={metaStyles.cultureZone__subtitle}>
        Where traditions blend with innovation.
      </p>

      <div className={metaStyles.cultureZone__container}>
        <div className={metaStyles.circle3}></div>
  <div className={metaStyles.circle4}></div>
        {cultureZoneCards.map((card, index) => (
          <div className={metaStyles.cultureZone__card} key={index}>
            <img
              src={card.img}
              alt={card.text}
              className={metaStyles.cultureZone__image}
            />
            <p className={metaStyles.cultureZone__title}>{card.text}</p>
            {/* <p className={metaStyles.cultureZone__desc}>{card.desc}</p> */}
          </div>
        ))}
      </div>

      <p className={metaStyles.cultureZone__description}>
        The Culture Zone (<strong>Indus Zone</strong>) celebrates diversity,
        connecting people, places, and traditions in one immersive digital
        space.
      </p> 

       <div className={metaStyles.buttonWrapper}>
      <button className={metaStyles.button} style={{marginTop:"-20%"}} onClick={() => window.location.href = "https://culture.decentrawood.com/"}>
      <span>Culture Zone</span>
      <div className={metaStyles.iconWrapper} >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 74 74"
          height="24"
          width="24"
        >
          <circle
            strokeWidth="3"
            stroke="white"
            fill="black"
            r="35.5"
            cy="37"
            cx="37"
          ></circle>
          <path
            fill="white"
            d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
          ></path>
        </svg>
      </div>
    </button>
  </div>
    </section>

</div>

    
  )
}

export default Metaversection
