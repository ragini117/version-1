"use client";
import React, { useEffect, useState } from "react";
import styles from "./community.module.css";
import { useRouter } from "next/navigation";
import Popup from "../PopUpMessage";
import { ethers } from "ethers";
import axios from "axios";
import { apiUrl } from "../../../environment";
import { useSelector, useDispatch } from "react-redux";
import { LAND_REDIRECT_SUCCESS } from "@/redux/states/loginState";
import Loader from "../../components/loaderDesign/index";
import Link from "next/link";

const index = () => {
    const router = useRouter();
    const { loginReducer } = useSelector((res) => res);
    const [communityData, setCommunityData] = useState(null);
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleContinueWallet = () => {
        router.push("/metawallet");
    };
    const handlePlayasGuest = () => {
        router.push("/playasguest");
    };
    const dummy = {
        walletAddress: "0x7f967ec284ce3e3e3503c19db74dc697aea4c0f2",
        level: 1,
        totalEarnings: 0,
        totalReferrals: 0,
    };
    const dummy2 = {};
    // console.log("communityData", communityData);
    const handleRedirecttoLogin = () => {
        const redirectLink = `/community`;
        dispatch({ type: LAND_REDIRECT_SUCCESS, payload: redirectLink });
        router.push("/login");
    };

    const handleJoin = async () => {
        setLoading(true);
        try {
            let provider;
            if (window.ethereum) {
                provider = window.ethereum;
            } else if (window.web3) {
                provider = window.web3.currentProvider;
            } else {
                window.alert("No ethereum browser !checkout metamask");
            }
            if (provider) {
                if (provider !== window.ethereum) {
                    console.error(
                        "Not window.ethereum.Do you have multiple wallets installed",
                    );
                }
                await provider.request({
                    method: "eth_requestAccounts",
                });
            }
            const yourToken = localStorage.getItem("_auth_token");
            const newProvider = new ethers.providers.Web3Provider(
                window.ethereum,
            );
            const signer = newProvider.getSigner();
            const address = await signer.getAddress();
            let profileresp;
            try {
                profileresp = await axios(`${apiUrl}/asset/getProfileAssets`, {
                    headers: {
                        Authorization: `Bearer ${yourToken}`,
                    },
                });
            } catch (error) {
                handleRedirecttoLogin();
            }
            setUserName(profileresp.data.data.userName);
            const payload = {
                walletAddress: address.toLowerCase(),
                referrerAddress: profileresp.data.data.referredBy,
            };
            const resp = await axios.post(
                `/community/check-or-create`,
                payload,
            );
            // console.log(resp.data.data);
            const resp2 = await axios(
                `/community/downline?walletAddress=${address.toLowerCase()}`,
            );
            setCommunityData(resp2.data.data.user);
            // console.log(resp2.data);
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    };
    const handleCopy = (textToCopy) => {
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => alert("Copied!"))
            .catch((err) => alert("Failed to copy: " + err));
    };
    const checkLogin = async () => {
        const yourToken = localStorage.getItem("_auth_token");
        if (!yourToken) {
            return;
        }
        setLoading(true);
        let profileresp;
        try {
            profileresp = await axios(`${apiUrl}/asset/getProfileAssets`, {
                headers: {
                    Authorization: `Bearer ${yourToken}`,
                },
            });
            if (profileresp) {
                await handleJoin();
            }
        } catch (error) {
            console.log(error)
        }
        setLoading(false);
    };
    const start_and_end = (address) => {
        if (address !== undefined) {
            return (
                address.substr(0, 10) +
                "...." +
                address.substr(address.length - 10, address.length)
            );
        }
        return address;
    };

    const handleWhatsAppShare = (inviteLink) => {
        const message = encodeURIComponent(
            `Join my community and earn rewards! Sign up using my link: ${inviteLink}`,
        );
        const url = `https://wa.me/?text=${message}`;
        window.open(url, "_blank");
    };

    const handleEmailShare = (inviteLink) => {
        const subject = encodeURIComponent(
            "Join my community and earn NEFI rewards",
        );
        const body = encodeURIComponent(
            `Hey,\n\nJoin my community on this platform and start earning NEFI tokens. Here's the link: ${inviteLink}\n\nSee you there!`,
        );
        const url = `mailto:?subject=${subject}&body=${body}`;
        window.open(url, "_blank");
    };
    useEffect(() => {
        checkLogin();
    }, []);

    return (
        <>
            {loading && <Loader loading={loading} />}
            {!loginReducer.isLogin || communityData == null ? (
                <div>
                    {/* Popup modal for new users */}
                    {/* <Popup isVisibleAfter={5000}>
            <h2>Your Chance to Win! 100 Users Get $1000 + 1,000 Points!</h2>
            <p>Sign up now! The first 100 users get $1,000 + 1,000 gaming points! This exclusive offer won’t last—act fast before it’s gone!</p>
          </Popup> */}
                    <div className={styles["wrapper"]}>
                        <div className={styles["product-img"]}>
                            <img
                                src="assets/community/meta.jpeg"
                                height={420}
                                width={400}
                            />
                        </div>
                        <div className={styles["product-info"]}>
                            <div className={styles["product-text"]}>
                                <h1>Build the Community </h1>

                                <div className={styles["button-container"]}>
                                    <div
                                        className={styles["product-price-btn"]}
                                    >
                                        <button
                                            type="button"
                                            className={styles["join-btn"]}
                                            onClick={() => router.push("/connectwallet")}
                                        >
                                            Join
                                        </button>
                                    </div>
                                    <div
                                        className={styles["product-price-btn"]}
                                    >
                                        <button
                                            type="button"
                                            className={styles["play-btn"]}
                                            onClick={() => window.location.href = "https://gaming.decentrawood.com"}
                                        >
                                            Play
                                        </button>
                                    </div>
                                    <div
                                        className={styles["product-price-btn"]}
                                    >
                                        <button
                                            type="button"
                                            className={styles["earn-btn"]}
                                            onClick={() => window.location.href = "https://gaming.decentrawood.com"}
                                        >
                                            Earn
                                        </button>
                                    </div>
                                    <div
                                        className={styles["product-price-btn"]}
                                    >
                                        <button
                                            type="button"
                                            className={styles["grow-btn"]}
                                            onClick={() => window.location.href = "https://gaming.decentrawood.com"}
                                        >
                                            Grow
                                        </button>
                                    </div>
                                </div>

                                <p>
                                    Decentrawood is more than a platform—it’s a
                                    thriving metaverse where engagement turns
                                    into rewards. Whether you're a gamer,
                                    creator, or crypto enthusiast, your
                                    involvement helps shape this ecosystem, and
                                    we make sure it’s worth your while.{" "}
                                </p>
                            </div>
                            {/* <div className={styles["product-price-btn"]}>
      <button type="button">buy now</button>
    </div> */}
                        </div>
                    </div>

                    <h1 className={`${styles["heading"]} `}>
                        How to Be a Community Builder & Earn Rewards{" "}
                    </h1>
                    <div className={styles["container"]}>
                        {/* <div className='row justify-content-center'></div> */}
                        <div className={styles["card-grid"]}>
                            <div className={styles["card"]}>
                                <div className={styles["card-content"]}>
                                    <div className={styles["card-image"]}>
                                        <img
                                            src="assets/community/glow.png"
                                            width={"307px"}
                                            height={"160px"}
                                        />
                                        {/* <div className={styles["glow"]} />
        </div> */}
                                    </div>
                                    <h2>
                                        <img
                                            src="assets/community/applicant.png"
                                            width={"50px"}
                                        />
                                        Register & Invite{" "}
                                    </h2>
                                    <p>
                                        <img
                                            src="assets/community/badge.png"
                                            width={"25px"}
                                        />{" "}
                                        Sign up through a referral and bring in
                                        more people to grow the community.{" "}
                                        <br />
                                        <img
                                            src="assets/community/badge.png"
                                            width={"25px"}
                                        />{" "}
                                        The more referrals you bring, the bigger
                                        your impact (and rewards!).{" "}
                                    </p>
                                    {/* <button><i className="fas fa-arrow-right" /> Learn More</button> */}
                                </div>
                            </div>

                            <div className={styles["card"]}>
                                <div className={styles["card-content"]}>
                                    <div className={styles["card-image"]}>
                                        <div className={styles["glow"]} />
                                        <img
                                            src="assets/community/promo1.jpg"
                                            width={"307px"}
                                            height={"190px"}
                                        />
                                    </div>
                                    <h2>
                                        <img
                                            src="assets/community/social-media-marketing.png"
                                            width={"50px"}
                                        />
                                        Promote & Win{" "}
                                    </h2>
                                    <p>
                                        <img
                                            src="assets/community/badge.png"
                                            width={"25px"}
                                        />{" "}
                                        Spread the word about Decentrawood on
                                        Twitter, Instagram, and Discord using
                                        hashtags like #Decentrawood, #DEOD,
                                        #MetaverseGaming, #PlayToEarn and more.{" "}
                                        <br />
                                        <img
                                            src="assets/community/badge.png"
                                            width={"25px"}
                                        />{" "}
                                        Engagement levels will be tracked—so the
                                        more you share, the more you earn!{" "}
                                    </p>

                                    {/* <button><i className="fas fa-arrow-right" /> Details</button> */}
                                </div>
                            </div>
                            <div className={styles["card"]}>
                                <div className={styles["card-content"]}>
                                    <div className={styles["card-image"]}>
                                        <div className={styles["glow"]} />
                                        <img
                                            src="assets/community/incentive.jpg"
                                            width={"307px"}
                                        />
                                    </div>
                                    <h2>
                                        <img
                                            src="assets/community/customer-experience.png"
                                            width={"50px"}
                                        />
                                        Get Incentives for Engagement{" "}
                                    </h2>
                                    <p>
                                        <img
                                            src="assets/community/badge.png"
                                            width={"25px"}
                                        />{" "}
                                        Earn rewards for contributing to the
                                        community—whether by participating in
                                        discussions, sharing insights, or
                                        helping newcomers. <br />
                                        <img
                                            src="assets/community/badge.png"
                                            width={"25px"}
                                        />{" "}
                                        Exclusive NFT drops, token bonuses, and
                                        leaderboard incentives await active
                                        members{" "}
                                    </p>
                                    {/* <button><i className="fas fa-arrow-right" /> Get Started</button> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles["banner-card"]}>
                        <div className={styles["text-left"]}>
                            <h1>Start Building Today! </h1>
                            <p>
                                Join the movement, invite your network, and turn
                                your community-building efforts into real
                                rewards.{" "}
                            </p>
                            <div className={styles["card-content"]}>
                                <button
                                    type="button"
                                    onClick={() => router.push("/register")}
                                >
                                    <i className="fas fa-arrow-right" />{" "}
                                    Register Now
                                </button>
                            </div>
                        </div>
                        <div className={styles["image-right"]}>
                            <img src="assets/community/2.jpg" alt="Cityscape" />
                        </div>
                    </div>

                    {/* 
      <div className={styles["about-container"]}>
        <div className={styles["image-container"]}>
          <img
            src="../assets/dashbordbanner.png"
            alt="Background"
            className={styles["background-image"]}
          />
        </div>
        <div className={styles["content"]}>
          <h2 className={styles["section-title"]}>The Decentrawood:</h2>
          <p>
            Welcome to Decentrawood, a groundbreaking virtual world at the
            intersection of blockchain technology, virtual reality, and artificial
            intelligence. Decentrawood offers users an immersive experience like
            no other, where the boundaries between the physical and digital realms
            blur, and endless possibilities await exploration.
          </p>
          <p>
            At Decentrawood, we believe in creating a new paradigm for virtual
            living, where users can socialize, communicate, travel, game, and
            entertain themselves in ways previously unimaginable. Our platform is
            powered by cutting-edge technology, including blockchain, which
            ensures data integrity, transparency, and security, enabling users to
            truly own and control their digital assets.
          </p>
          <p>
            With Decentrawood, anyone can become a citizen of this virtual world,
            where they can buy land, build or import non-fungible tokens (NFTs),
            create avatars, and immerse themselves in entirely different
            realities. Whether you're a content creator, gamer, entrepreneur, or
            simply looking for new experiences, Decentrawood welcomes you to join
            our growing community and shape the future of virtual reality.
          </p>
        </div>
        <div className={styles["content"]}>
          <h2 className={styles["section-title"]}>What is LAND?</h2>
          <p>
            In Decentrawood, LAND represents digital parcels of virtual real
            estate that users can own, develop, and monetize within the virtual
            world. These LAND parcels serve as the foundation for building
            immersive experiences, whether it's creating virtual homes,
            businesses, entertainment venues, or entire ecosystems.
          </p>
          <p>
            Owning LAND in Decentrawood grants users exclusive rights to develop
            and customize their virtual properties, including the ability to
            design landscapes, construct buildings, and host events. Additionally,
            LANDowners have the opportunity to earn passive income by leasing or
            selling their virtual properties to other users, fostering a dynamic
            and vibrant virtual economy.
          </p>
          <p>
            With LAND, users can unleash their creativity and entrepreneurial
            spirit, transforming virtual landscapes into thriving communities and
            digital destinations. Whether you're a seasoned developer or a novice
            explorer, LAND offers endless possibilities for innovation and
            expression within the Decentrawood metaverse.
          </p>
        </div>
        <div className={styles["content"]}>
          <h2 className={styles["section-title"]}>DEOD Token:</h2>
          <p>
            The DEOD token is the native utility token of Decentrawood, designed
            to facilitate transactions, incentivize user participation, and govern
            the decentralized ecosystem. DEOD tokens serve as the primary medium
            of exchange within the platform, enabling users to purchase virtual
            assets, pay for services, and participate in decentralized governance.
          </p>
          <p>
            As the backbone of the Decentrawood economy, DEOD tokens play a vital
            role in driving value and fostering community engagement. Users can
            earn DEOD tokens through various activities, such as creating and
            trading digital assets, participating in events, contributing to the
            platform's development, and staking tokens to secure the network.
          </p>
          <p>
            Furthermore, DEOD tokens enable users to take part in the governance
            of Decentrawood through decentralized autonomous organizations (DAOs),
            where they can propose and vote on changes, upgrades, and initiatives
            that shape the future of the platform. By leveraging blockchain
            technology and decentralized governance, DEOD tokens empower users to
            collectively govern and evolve the Decentrawood ecosystem for the
            benefit of all participants.
          </p>
        </div>
      </div> */}
                </div>
            ) : (
                <div
                    className="py-5 text-light"
                    style={{
                        background:
                            "radial-gradient(circle at top, #1a1a1a 0%, #000000 100%)",
                        minHeight: "100vh",
                    }}
                >
                    <div className="container">
                        {/* Header Section */}
                        <div className="text-center mb-5">
                            <h2
                                className="fw-bold mb-3"
                                style={{
                                    fontSize: "3rem",
                                    background:
                                        "linear-gradient(to right, #0dcaf0, #f093fb, #f5576c)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    textShadow:
                                        "0 4px 20px rgba(240, 147, 251, 0.3)",
                                }}
                            >
                                Community Builder
                            </h2>
                            <p
                                className="fs-5 text-secondary mb-4"
                                style={{ letterSpacing: "1px" }}
                            >
                                Grow together. Earn together.
                            </p>
                            <div
                                className="d-inline-flex flex-column align-items-center p-3 rounded-4"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    backdropFilter: "blur(10px)",
                                }}
                            >
                                <h3 className="fw-bold text-white mb-1">
                                    @{userName}
                                </h3>
                                <small
                                    className="text-info fw-semibold"
                                    style={{ letterSpacing: "2px" }}
                                >
                                    {start_and_end(communityData.walletAddress)}
                                </small>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="row g-4 mb-5">
                            {/* Community Stats */}
                            <div className="col-md-6">
                                <div
                                    className="card border-0 h-100 p-4"
                                    style={{
                                        background:
                                            "linear-gradient(145deg, rgba(40,40,40,0.6), rgba(20,20,20,0.8))",
                                        borderRadius: "24px",
                                        border: "1px solid rgba(255,255,255,0.05)",
                                        boxShadow:
                                            "0 10px 30px rgba(0,0,0,0.3)",
                                        backdropFilter: "blur(10px)",
                                        transition: "all 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform =
                                            "translateY(-5px)";
                                        e.currentTarget.style.boxShadow =
                                            "0 15px 40px rgba(13, 202, 240, 0.2)";
                                        e.currentTarget.style.borderColor =
                                            "rgba(13, 202, 240, 0.3)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform =
                                            "translateY(0)";
                                        e.currentTarget.style.boxShadow =
                                            "0 10px 30px rgba(0,0,0,0.3)";
                                        e.currentTarget.style.borderColor =
                                            "rgba(255,255,255,0.05)";
                                    }}
                                >
                                    <div className="d-flex align-items-center mb-4">
                                        <div
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                borderRadius: "50%",
                                                background:
                                                    "linear-gradient(135deg, #0dcaf0 0%, #0d6efd 100%)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: "15px",
                                                boxShadow:
                                                    "0 4px 15px rgba(13, 202, 240, 0.4)",
                                            }}
                                        >
                                            <i className="bi bi-people-fill text-white fs-4"></i>
                                        </div>
                                        <h4 className="fw-bold text-white mb-0">
                                            My Community
                                        </h4>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-end mt-auto">
                                        <span
                                            className="text-secondary fw-semibold text-uppercase"
                                            style={{ letterSpacing: "1px" }}
                                        >
                                            Total Members
                                        </span>
                                        <h2
                                            className="fw-bold mb-0"
                                            style={{ color: "#0dcaf0" }}
                                        >
                                            {communityData.totalReferrals}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            {/* Rewards Stats */}
                            <div className="col-md-6">
                                <div
                                    className="card border-0 h-100 p-4"
                                    style={{
                                        background:
                                            "linear-gradient(145deg, rgba(40,40,40,0.6), rgba(20,20,20,0.8))",
                                        borderRadius: "24px",
                                        border: "1px solid rgba(255,255,255,0.05)",
                                        boxShadow:
                                            "0 10px 30px rgba(0,0,0,0.3)",
                                        backdropFilter: "blur(10px)",
                                        transition: "all 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform =
                                            "translateY(-5px)";
                                        e.currentTarget.style.boxShadow =
                                            "0 15px 40px rgba(245, 87, 108, 0.2)";
                                        e.currentTarget.style.borderColor =
                                            "rgba(245, 87, 108, 0.3)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform =
                                            "translateY(0)";
                                        e.currentTarget.style.boxShadow =
                                            "0 10px 30px rgba(0,0,0,0.3)";
                                        e.currentTarget.style.borderColor =
                                            "rgba(255,255,255,0.05)";
                                    }}
                                >
                                    <div className="d-flex align-items-center mb-4">
                                        <div
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                borderRadius: "50%",
                                                background:
                                                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: "15px",
                                                boxShadow:
                                                    "0 4px 15px rgba(245, 87, 108, 0.4)",
                                            }}
                                        >
                                            <i className="bi bi-gift-fill text-white fs-4"></i>
                                        </div>
                                        <h4 className="fw-bold text-white mb-0">
                                            My Rewards
                                        </h4>
                                    </div>
                                    <div className="mb-3 d-flex justify-content-between align-items-end">
                                        <span
                                            className="text-secondary fw-semibold text-uppercase"
                                            style={{ letterSpacing: "1px" }}
                                        >
                                            Total Earned
                                        </span>
                                        <h2
                                            className="fw-bold mb-0"
                                            style={{ color: "#f5576c" }}
                                        >
                                            {communityData.totalEarnings}{" "}
                                            <span className="fs-5 text-secondary">
                                                DEOD
                                            </span>
                                        </h2>
                                    </div>
                                    <div
                                        className="progress rounded-pill bg-dark"
                                        style={{
                                            height: "8px",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            className="progress-bar progress-bar-striped progress-bar-animated"
                                            role="progressbar"
                                            style={{
                                                width: "10%",
                                                background:
                                                    "linear-gradient(to right, #f093fb, #f5576c)",
                                            }}
                                            aria-valuenow="10"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invite Section */}
                        <div
                            className="card border-0 mb-5 p-4 p-md-5"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(30,30,30,0.8), rgba(15,15,15,0.95))",
                                borderRadius: "24px",
                                border: "1px solid rgba(255,255,255,0.05)",
                                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Decorative background elements */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: "-50%",
                                    right: "-10%",
                                    width: "300px",
                                    height: "300px",
                                    background:
                                        "radial-gradient(circle, rgba(13,202,240,0.15) 0%, rgba(0,0,0,0) 70%)",
                                    borderRadius: "50%",
                                    pointerEvents: "none",
                                }}
                            ></div>
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "-50%",
                                    left: "-10%",
                                    width: "300px",
                                    height: "300px",
                                    background:
                                        "radial-gradient(circle, rgba(245,87,108,0.15) 0%, rgba(0,0,0,0) 70%)",
                                    borderRadius: "50%",
                                    pointerEvents: "none",
                                }}
                            ></div>

                            <div className="row align-items-center position-relative z-1">
                                <div className="col-lg-6 mb-4 mb-lg-0">
                                    <div className="d-flex align-items-center mb-3">
                                        <i
                                            className="bi bi-megaphone-fill fs-2 me-3"
                                            style={{ color: "#fbbf24" }}
                                        ></i>
                                        <h3 className="fw-bold text-white mb-0">
                                            Invite & Earn
                                        </h3>
                                    </div>
                                    <p className="text-secondary fs-5">
                                        Invite your friends and earn{" "}
                                        <strong className="text-white">
                                            10 DEOD
                                        </strong>{" "}
                                        per signup and{" "}
                                        <strong className="text-white">
                                            2 DEOD
                                        </strong>{" "}
                                        per Indirect Member.
                                    </p>
                                </div>
                                <div className="col-lg-6">
                                    <div
                                        className="input-group mb-3 p-1 rounded-pill"
                                        style={{
                                            background: "rgba(0,0,0,0.4)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                        }}
                                    >
                                        <input
                                            type="text"
                                            className="form-control bg-transparent border-0 text-secondary px-4 shadow-none"
                                            value={`https://decentrawood.com/metawallet?referral=${communityData?.walletAddress}`}
                                            readOnly
                                            style={{ outline: "none" }}
                                        />
                                        <button
                                            className="btn rounded-pill px-4 fw-bold"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #0dcaf0, #0d6efd)",
                                                color: "white",
                                                border: "none",
                                                boxShadow:
                                                    "0 4px 15px rgba(13, 202, 240, 0.4)",
                                            }}
                                            onClick={() =>
                                                handleCopy(
                                                    `https://decentrawood.com/metawallet?referral=${communityData?.walletAddress}`,
                                                )
                                            }
                                        >
                                            Copy Link
                                        </button>
                                    </div>
                                    <div className="d-flex gap-3 justify-content-lg-end">
                                        <button
                                            className="btn rounded-pill px-4 d-flex align-items-center gap-2 fw-semibold"
                                            style={{
                                                background: "#25D366",
                                                color: "white",
                                                border: "none",
                                                transition: "all 0.2s ease",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.filter =
                                                    "brightness(1.1)")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.filter =
                                                    "brightness(1)")
                                            }
                                            onClick={() =>
                                                handleWhatsAppShare(
                                                    `https://decentrawood.com/metawallet?referral=${communityData?.walletAddress}`,
                                                )
                                            }
                                        >
                                            <i className="bi bi-whatsapp"></i>{" "}
                                            Share
                                        </button>
                                        <button
                                            className="btn rounded-pill px-4 d-flex align-items-center gap-2 fw-semibold"
                                            style={{
                                                background:
                                                    "rgba(255,255,255,0.1)",
                                                color: "white",
                                                border: "1px solid rgba(255,255,255,0.2)",
                                                transition: "all 0.2s ease",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.background =
                                                    "rgba(255,255,255,0.2)")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.background =
                                                    "rgba(255,255,255,0.1)")
                                            }
                                            onClick={() =>
                                                handleEmailShare(
                                                    `https://decentrawood.com/metawallet?referral=${communityData?.walletAddress}`,
                                                )
                                            }
                                        >
                                            <i className="bi bi-envelope"></i>{" "}
                                            Email
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard & Recent */}
                        <div className="row g-4">
                            {/* Leaderboard */}
                            <div className="col-md-6">
                                <div
                                    className="card border-0 h-100 p-4"
                                    style={{
                                        background:
                                            "linear-gradient(145deg, rgba(30,30,30,0.6), rgba(15,15,15,0.8))",
                                        borderRadius: "24px",
                                        border: "1px solid rgba(255,255,255,0.05)",
                                        backdropFilter: "blur(10px)",
                                    }}
                                >
                                    <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                                        <i
                                            className="bi bi-trophy-fill fs-3 me-3"
                                            style={{ color: "#fbbf24" }}
                                        ></i>
                                        <h4 className="fw-bold text-white mb-0">
                                            Leaderboard
                                        </h4>
                                    </div>
                                    <ul
                                        className="list-unstyled mb-0 d-flex flex-column align-items-center justify-content-center flex-grow-1"
                                        style={{ minHeight: "150px" }}
                                    >
                                        <li className="text-secondary d-flex flex-column align-items-center">
                                            <i className="bi bi-hourglass-split fs-1 mb-2 opacity-50"></i>
                                            <span
                                                className="fw-semibold text-uppercase"
                                                style={{ letterSpacing: "1px" }}
                                            >
                                                Coming Soon
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Recent Rewards */}
                            <div className="col-md-6">
                                <div
                                    className="card border-0 h-100 p-4"
                                    style={{
                                        background:
                                            "linear-gradient(145deg, rgba(30,30,30,0.6), rgba(15,15,15,0.8))",
                                        borderRadius: "24px",
                                        border: "1px solid rgba(255,255,255,0.05)",
                                        backdropFilter: "blur(10px)",
                                    }}
                                >
                                    <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                                        <i
                                            className="bi bi-stars fs-3 me-3"
                                            style={{ color: "#a855f7" }}
                                        ></i>
                                        <h4 className="fw-bold text-white mb-0">
                                            Recent Rewards
                                        </h4>
                                    </div>
                                    <ul
                                        className="list-unstyled mb-0 d-flex flex-column align-items-center justify-content-center flex-grow-1"
                                        style={{ minHeight: "150px" }}
                                    >
                                        <li className="text-secondary d-flex flex-column align-items-center">
                                            <i className="bi bi-clock-history fs-1 mb-2 opacity-50"></i>
                                            <span
                                                className="fw-semibold text-uppercase"
                                                style={{ letterSpacing: "1px" }}
                                            >
                                                Coming Soon
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default index;
