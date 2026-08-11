"use client";
import React, { useState, useEffect } from 'react'
import socialzonestyles from "../SocialZoneDesign/socialzonedesign.module.css"
import Image from 'next/image';

const SocialZonesection = () => {
  const [activeFilter, setActiveFilter] = useState("Live Now");

  const filters = ["Live Now", "This Week", "Featured", "Friend-Hosted"];

  const events = [
    {
      id: 1,
      title: "Virtual Dance Night",
      time: "Live Now",
      image: "/assets/Socialimages/Untitled design/club.jpg",
      tag: "Live Now",
    },
    {
      id: 2,
      title: "Café Chill Meetup",
      time: "Today, 7 PM",
      image: "/assets/Socialimages/Untitled design/cafe.jpg",
      tag: "Featured",
    },
    {
      id: 3,
      title: "Music Jam Lounge",
      time: "Tomorrow, 8 PM",
      image: "/assets/Socialimages/Untitled design/download (32).jpg",
      tag: "This Week",
    },
    {
      id: 4,
      title: "VR Game Night",
      time: "Friday, 9 PM",
      image: "/assets/Socialimages/Untitled design/Get ready for next level fun with VR! Trampoline park now features virtual reality games that takes your perspective into another world! Whether youre racing cars or saving the world, its an immersive experience fo.jpg",
      tag: "Friend-Hosted",
    },
  ];

  const groups = [
    {
      name: "Metaverse Gamers",
      img: "/assets/Socialimages/mgamer.jpg",
      members: "32K Members",
    },
    {
      name: "AI Art Lovers",
      img: "/assets/Socialimages/Mart.jpg",
      members: "18K Members",
    },
    {
      name: "Party Lounge",
      img: "/assets/Socialimages/Mclub.jpg",
      members: "25K Members",
    },
    {
      name: "Chill & Coffee",
      img: "/assets/Socialimages/mcafe.jpg",
      members: "12K Members",
    },
  ];

  const faqItems = [
    {
      title: "How is my data protected?",
      content:
        "All user data is secured through decentralized storage and blockchain-backed ownership — meaning no central entity controls your information.",
    },
    {
      title: "Who can see my activities?",
      content:
        "You decide your visibility. Your circles and access levels are fully customizable with granular privacy options.",
    },
    {
      title: "Can I remove or export my data?",
      content:
        "Yes. You can export or completely wipe your data at any time. You always have ownership.",
    },
    {
      title: "Is communication encrypted?",
      content:
        "Messages and interactions are end-to-end encrypted, ensuring only you and your connections can read them.",
    },
  ];


  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };


  const filteredEvents =
    activeFilter === "All"
      ? events
      : events.filter((e) => e.tag === activeFilter);

  return (
    <>
      <section className={socialzonestyles.section}>
        <div className={socialzonestyles.container}>
          {/* Headline */}
          <h1 className={socialzonestyles.headline}>
            Your World. Your Circle. One Social Universe.
          </h1>

          {/* Subheadline */}
          <p className={socialzonestyles.subheadline}>
            Meet, chat, party, or chill — from your phone or inside the metaverse.
            Decentrawood makes social fun again.
          </p>

          {/* CTAs */}
          <div className={socialzonestyles.ctaButtons}>
            <a href="https://glamour.decentrawood.com/">
              <button className={socialzonestyles.primaryBtn}>Download the App</button>
            </a>
            <a href="https://maps-decentrawood.s3.ap-south-1.amazonaws.com/Cupid_Hub_Web_New_Final+V2/index.html">
              <button className={socialzonestyles.secondaryBtn}>Enter Cupid Hub</button>
            </a>
          </div>

          {/* 5-card layout */}
          <div className={socialzonestyles.cardsGrid}>
            {/* Left tall card */}
            <div className={`${socialzonestyles.card} ${socialzonestyles.leftTall}`} >
              <div className={socialzonestyles.cardContent} >
                <p>
                  Connect your circles and experience a new dimension of social
                  interaction — real or virtual.
                </p>
              </div>
            </div>

            {/* Left small card */}
            <div className={`${socialzonestyles.card} ${socialzonestyles.leftSmall}`}>
              <h3>+350%</h3>
              <p>Community growth rate</p>
            </div>

            {/* Center card (wide) */}
            <div className={`${socialzonestyles.card} ${socialzonestyles.centerCard}`}>
              <Image
                src="/assets/Socialimages/social3.png"
                alt="Friends socializing"
                width={400}
                height={260}
                className={socialzonestyles.cardImage}
              />
            </div>

            {/* Right small card */}
            <div className={`${socialzonestyles.card} ${socialzonestyles.rightSmall}`}>
              <h3>95%</h3>
              <p>Users engaged daily</p>
            </div>

            {/* Right tall card */}
            <div className={`${socialzonestyles.card} ${socialzonestyles.rightTall}`}>
              <Image
                src="/assets/Socialimages/social1.png"
                alt="User on laptop"
                width={400}
                height={260}
                className={socialzonestyles.cardImage}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={socialzonestyles.feed_section}>
        <div className={socialzonestyles.feed_iconWrapper}>
          <img src="/assets/Socialimages/icon2.png" className={`${socialzonestyles.feed_icon} ${socialzonestyles.icon1}`} />
          <img src="/assets/Socialimages/icon3.png" className={`${socialzonestyles.feed_icon} ${socialzonestyles.icon2}`} />
          {/* <img src="/assets/Socialimages/icon6.gif" className={`${socialzonestyles.feed_icon} ${socialzonestyles.icon3}`} /> */}
          {/* <img src="/assets/Socialimages/icon7.png" className={`${socialzonestyles.feed_icon} ${socialzonestyles.icon4}`} /> */}

          {/* GIF - no animation */}
          {/* <img src="/assets/Socialimages/icon6.gif" className={socialzonestyles.feed_iconGif} /> */}
          {/* <img src="/assets/Socialimages/icon8.gif" className={socialzonestyles.feed_iconGif1} /> */}

        </div>

        <div className={socialzonestyles.feed_container}>
          {/* Headline */}
          <h2 className={socialzonestyles.feed_headline}>
            Stay Connected Like Never Before
          </h2>

          {/* Subheadline */}
          <p className={socialzonestyles.feed_subheadline}>
            Share your vibe. React to moments. Stay close to the people who make
            your metaverse brighter.
          </p>

          {/* CTA Buttons */}
          <div className={socialzonestyles.feed_ctaButtons}>
            <button className={socialzonestyles.feed_primaryBtn}>Post Something</button>
            {/* <button className={socialzonestyles.feed_secondaryBtn}>Find Friends</button> */}
           <a href='/community'>
            <button className={socialzonestyles.feed_secondaryBtn}>Join a Group</button>
         </a>
          </div>

          {/* Feed Preview */}
          <div className={socialzonestyles.feed_grid}>
            {/* Post 1 */}
            <div className={socialzonestyles.feed_postCard}>
              <div className={socialzonestyles.feed_postHeader}>
                <div className={socialzonestyles.feed_avatar}></div>
                <div>
                  <h4 className={socialzonestyles.feed_username}>@aurora</h4>
                  <p className={socialzonestyles.feed_time}>2h ago</p>
                </div>
              </div>
              <p className={socialzonestyles.feed_postText}>
                Just dropped by the new Decentrawood plaza — unreal energy tonight ✨
              </p>
              <div className={socialzonestyles.feed_postMedia}>
                <Image
                  src="/assets/Socialimages/How AR & VR Will Revolutionize Social Interaction and Entertainment.jpg"
                  alt="User post"
                  width={600}
                  height={300}
                  className={socialzonestyles.feed_postImage}
                />
              </div>
            </div>

            {/* Post 2 */}
            <div className={socialzonestyles.feed_postCard}>
              <div className={socialzonestyles.feed_postHeader}>
                <div className={socialzonestyles.feed_avatar}></div>
                <div>
                  <h4 className={socialzonestyles.feed_username}>@metajay</h4>
                  <p className={socialzonestyles.feed_time}>5h ago</p>
                </div>
              </div>
              <p className={socialzonestyles.feed_postText}>
                Shared a quick highlight from the virtual concert last night 🎶
              </p>
              <div className={socialzonestyles.feed_postMedia}>
                <Image
                  src="/assets/Socialimages/Enter the Boundless Beyond! 🚀✨ Explore the Wonders of the Virtual World 🕹️🔮.jpg"
                  alt="User post"
                  width={600}
                  height={300}
                  className={socialzonestyles.feed_postImage}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={socialzonestyles.app_section}>
        <div className={socialzonestyles.app_container}>
          {/* Headline */}
          <h2 className={socialzonestyles.app_headline}>
            Carry the Decentrawood Social Experience in Your Pocket.
          </h2>

          {/* Subheadline */}
          <p className={socialzonestyles.app_subheadline}>
            Make friends, chat, or find your match with <span className={socialzonestyles.app_name}>Heartlink</span> —
            the official social app of Decentrawood.
          </p>

          {/* CTAs */}
          <div className={socialzonestyles.app_ctaButtons}>
            {/* <button className={socialzonestyles.app_primaryBtn}>Download for Android</button>
            <button className={socialzonestyles.app_secondaryBtn}>Download for iOS</button> */}
          </div>

          {/* Mockup Section */}
          <div className={socialzonestyles.app_mockupRow}>

            {/* Left Phone (Image) */}
            <div className={socialzonestyles.app_phone}>
              <div className={socialzonestyles.app_screen}>
                <img
                  src="/assets/Socialimages/dating1.png"
                  className={socialzonestyles.app_screenImage}
                  alt="Left mockup"
                />
              </div>
            </div>

            {/* Middle Phone (Video) */}
            <div className={socialzonestyles.app_phone}>
              <div className={socialzonestyles.app_screen}>
                <video
                  src="/assets/Socialimages/Untitleddesign.mp4"
                  className={socialzonestyles.app_screenImage}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>

            {/* Right Phone (Image) */}
            <div className={socialzonestyles.app_phone}>
              <div className={socialzonestyles.app_screen}>
                <img
                  src="/assets/Socialimages/dating3.png"
                  className={socialzonestyles.app_screenImage}
                  alt="Right mockup"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className={socialzonestyles.hub_section}>
        {/* Animated background overlay */}
        <div className={socialzonestyles.hub_background}></div>
        <div className={socialzonestyles.hub_overlay}></div>
        <div className={socialzonestyles.hub_content}>
          {/* Headline */}
          <h2 className={socialzonestyles.hub_headline}>
            Enter Cupid Hub — The Social Soul of Decentrawood
          </h2>

          {/* Subtext */}
          <p className={socialzonestyles.hub_subtext}>
            Your gateway to hangouts, coffee dates, dance nights, and spontaneous parties —
            all in an immersive 3D world.
          </p>

          {/* CTA Buttons */}
          <div className={socialzonestyles.hub_ctaContainer}>
            <a href='https://glamour.decentrawood.com/'>
            <button className={socialzonestyles.hub_primaryBtn}>Explore in 3D</button>
           </a>
           <a href='/community'>
            <button className={socialzonestyles.hub_secondaryBtn}>Join with Friends</button>
           </a>
          </div>

          {/* Image Left + Vertical Videos Right */}
          {/* Image Left + Auto-Scrolling Videos Right */}
          <div className={socialzonestyles.hub_sideBySide}>
            <div className={socialzonestyles.leftMedia}>
              <Image
                src="/assets/Glamour images/cupid hub.png"
                alt="Cupid Hub"
                width={1200}
                height={600}
                className={socialzonestyles.mainImage}
              />
            </div>

            <div className={socialzonestyles.rightVideos}>
              <div className={socialzonestyles.videoGrid}>
                <video src="/assets/Socialimages/All Fails, One Win – Cupid Hub NFTs!.mp4" autoPlay loop muted className={`${socialzonestyles.videoCard} ${socialzonestyles.scrollUp}`}></video>

                <video src="/assets/Socialimages/Cupid Hub Reel 2.mp4" autoPlay loop muted className={`${socialzonestyles.videoCard} ${socialzonestyles.scrollDown}`}></video>

                <video src="/assets/Socialimages/NFT for teenagers in cupid hub.mp4" autoPlay loop muted className={`${socialzonestyles.videoCard} ${socialzonestyles.scrollUp}`}></video>

                <video src="/assets/Socialimages/vidoe4.mp4" autoPlay loop muted className={`${socialzonestyles.videoCard} ${socialzonestyles.scrollDown}`}></video>
              </div>
            </div>
          </div>



        </div>
      </section>


      <section className={socialzonestyles.events_section}>
        <div className={socialzonestyles.events_container}>
          {/* Headline */}
          <h2 className={socialzonestyles.events_headline}>
            Events & Experiences — Something’s Always Happening
          </h2>

          {/* Subtext */}
          <p className={socialzonestyles.events_subtext}>
            Join virtual parties, community meetups, or café hangouts — happening
            daily inside Decentrawood.
          </p>

          {/* Filters */}
          <div className={socialzonestyles.events_filters}>
            {filters.map((filter) => (
              <button
                key={filter}
                className={`${socialzonestyles.events_filterBtn} ${activeFilter === filter ? socialzonestyles.active : ""
                  }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div className={socialzonestyles.events_grid}>
            {filteredEvents.map((event) => (
              <div key={event.id} className={socialzonestyles.events_card}>
                <div className={socialzonestyles.events_imageWrapper}>
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={400}
                    height={240}
                    className={socialzonestyles.events_image}
                  />
                  <span className={socialzonestyles.events_tag}>{event.tag}</span>
                </div>
                <div className={socialzonestyles.events_info}>
                  <h3>{event.title}</h3>
                  <p>{event.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className={socialzonestyles.events_cta}>
            <a href='/news'>
            <button className={socialzonestyles.events_ctaBtn}>See All Events</button>
            </a>
          </div>
        </div>
      </section>


      <section className={socialzonestyles.circlezone_section}>
        <div className={socialzonestyles.circlezone_container}>

          <h2 className={socialzonestyles.circlezone_header}>
            Join circles that share your vibe.
          </h2>

          <div className={socialzonestyles.circlezone_groupsGrid}>
            {groups.map((group, index) => (
              <div className={socialzonestyles.circlezone_card} key={index}>

                <div className={socialzonestyles.circlezone_imageWrapper}>
                  <img
                    src={group.img}
                    alt={group.name}
                    className={socialzonestyles.circlezone_groupImg}
                  />
                </div>

                <h3 className={socialzonestyles.circlezone_groupName}>
                  {group.name}
                </h3>

                <p className={socialzonestyles.circlezone_members}>
                  {group.members}
                </p>

                <button className={socialzonestyles.circlezone_joinBtn}>
                  View Group
                </button>
              </div>
            ))}
          </div>

          <a href='/community'>
          <button className={socialzonestyles.circlezone_exploreBtn}>
            Explore Groups
          </button>
          </a>

        </div>
      </section>


      <section className={socialzonestyles.sp_section}>
        <div className={socialzonestyles.sp_container}>

          <h2 className={socialzonestyles.sp_header}>Your Space, Your Rules</h2>

          <p className={socialzonestyles.sp_description}>
            Every connection you make is secured through blockchain ownership and
            decentralized storage. You decide what stays private — always.
          </p>

          <div className={socialzonestyles.sp_faqWrapper}>
            {faqItems.map((item, index) => (
              <div className={socialzonestyles.sp_faqCard} key={index}>
                <button
                  className={socialzonestyles.sp_question}
                  onClick={() => toggle(index)}
                >
                  <span>{item.title}</span>
                  <span className={socialzonestyles.sp_icon}>
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>

                <div
                  className={`${socialzonestyles.sp_answer} ${openIndex === index ? socialzonestyles.open : ""
                    }`}
                >
                  <p>{item.content}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <section className={socialzonestyles.ctaSection}>
        <div className={socialzonestyles.ctaWrapper}>

          {/* Floating Avatars Background */}
          <div className={socialzonestyles.floatingAvatars}>
            {/* <img src="/assets/Socialimages/icon9.png" className={socialzonestyles.avatar} /> */}
            <img src="/assets/Socialimages/icon9.png" className={socialzonestyles.avatar} />
            {/* <img src="/assets/Socialimages/icon9.png" className={socialzonestyles.avatar} /> */}
          </div>

          {/* Main Content */}
          <h2 className={socialzonestyles.title}>
            Ready to meet, mingle & explore the metaverse?
          </h2>

          <div className={socialzonestyles.buttons}>
            {/* <a href=''>
            <button className={socialzonestyles.primaryBtn}>Download the App</button>
            </a> */}
             <a href='https://maps-decentrawood.s3.ap-south-1.amazonaws.com/Cupid_Hub_Web_New_Final+V2/index.html'>
            <button className={socialzonestyles.secondaryBtn}>Explore Cupid Hub</button>
            </a>
          </div>

        </div>
      </section>
    </>
  )
}
export default SocialZonesection