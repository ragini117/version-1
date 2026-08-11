"use client";
import React, { useEffect, useState } from "react";
import styles from "../../app/page.module.css";
import "aos/dist/aos.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { UserLogout } from "@/redux/actions/loginAction";
import Swal from "sweetalert2";
import axios from "axios";
import Chatbot from '../Chatbot/index'
const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loginReducer } = useSelector((res) => res);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogOut = () => {
    Swal.fire({
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(UserLogout());
      }
    });
  };
  const [marketLink, setMarketLink] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [userName, setUserName] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);


  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  // const [listeningText, setListeningText] = useState("listening...");

  // const startListening = () => {

  //   const speechRecognition =
  //     window.SpeechRecognition || window.webkitSpeechRecognition;
  //   const SpeechGrammarList =
  //     window.SpeechGrammarList || window.webkitSpeechGrammarList;
  //     if (!speechRecognition) {
  //       alert('Speech recognition not supported in this browser.');
  //       return;
  //     }
  //     const recogntion = new speechRecognition();

  //   const grammarList = new SpeechGrammarList();

  //   // Define the custom grammar
  //   const grammar = `#JSGF V1.0; grammar words; public <word> = decentrawood ;`;
  //   grammarList.addFromString(grammar, 1);
  //   recogntion.grammars = grammarList;
  //   recogntion.onstart = () => {
  //     // console.log('Speech recognition started');
  //     setIsListening(true);
  //   };
  //   recogntion.onresult = async (event) => {
  //     try {
  //       const transcript = event.results[0][0].transcript;
  //       console.log(transcript, "transcript");
  //       //   const correctedText = correctRecognition(transcript)
  //       // console.log(correctedText);
  //       setListeningText(transcript);
  //       // const resp = await axios.post("https://ec2-3-87-20-56.compute-1.amazonaws.com/", {
  //       // const resp = await axios.post("http://192.168.1.38:6001/", {
  //         const resp = await axios.post("https://chatbot.decentrawood.com/", {
  //         text: transcript,
  //       });

  //       const utterance = new SpeechSynthesisUtterance(resp.data.response_text);

  //       // Get the list of voices
  //       const voices = window.speechSynthesis.getVoices();

  //       // Select a female voice (adjust the condition based on available voices)
  //       const femaleVoice = voices.find(
  //         (voice) => voice.name.includes("Female") || voice.gender === "female"
  //       );

  //       // If a female voice is found, use it
  //       if (femaleVoice) {
  //         utterance.voice = femaleVoice;
  //       }

  //       // Set the speaking rate (1.0 is normal, > 1.0 is faster)
  //       utterance.rate = 1.2; // Adjust as needed

  //       window.speechSynthesis.speak(utterance);
  //       if (resp.data.url) {
  //         router.push(resp.data.url);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     setIsListening(false);
  //     setListeningText('listening...')
  //   };
  //   recogntion.start();
  // };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const isPageScrolled = scrollTop > 50;
      setIsScrolled(isPageScrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (loginReducer.isLogin) {
      setMarketLink(true);
      if (loginReducer?.userDetail?.data?.userName) {
        setUserName(loginReducer.userDetail.data.userName);
      }
    } else {
      setMarketLink(false);
      setUserName("");
    }
  }, [loginReducer]);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <nav className={styles.heroNavbar}>
      <div className={styles.heroLogo}>
        <Link href={"/"}>
          <img
            src="/assets/logoicon.png"
            alt="decentrawood Logo"
            style={{ width: "60px" }}
          />
        </Link>
      </div>

      {/* Nav Links */}
      <ul
        className={`${styles.heroMenu} ${
          menuOpen ? styles.showMenu : ""
        }`}
      >
        <button
          className={styles.sidebarClose}
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          &#x2715;
        </button>
         <li>
          <Link
            href="/what-is-decentrawood"
            className={styles.heroLink}
          >
            About
          </Link>
        </li>
        <li>
          <a
            href="https://gaming.decentrawood.com/"
            className={styles.heroLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Gaming
          </a>
        </li>
        <li>
          <a
            href="https://deod.ai/"
            className={styles.heroLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            DEOD.Ai
          </a>
        </li>
         <li>
          <a
            href="https://deodstaking.decentrawood.com/"
            className={styles.heroLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            DEOD Staking
          </a>
        </li>
        {/* <li>
          <a
            href="/metaverse"
            className={styles.heroLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Metaverse
          </a>
        </li> */}
        <li
          className={`${styles.heroDropdown} ${
            isHovered1 || openDropdown === "metaverse" ? styles.show : ""
          }`}
          onMouseEnter={() => setIsHovered1(true)}
          onMouseLeave={() => setIsHovered1(false)}
        >
          <span
            className={`${styles.heroLink} ${styles.heroDropdownToggle}`}
            onClick={(e) => {
              if (window.innerWidth <= 1200) {
                setOpenDropdown(openDropdown === "metaverse" ? null : "metaverse");
              }
            }}
          >
            Metaverse
          </span>
          <ul
            className={`${styles.heroDropdownMenu} ${
              isHovered1 || openDropdown === "metaverse" ? styles.show : ""
            }`}
          >
            <li>
              <Link href="/metaverse" className={styles.heroDropdownItem}>
                Overview
              </Link>
            </li>
            <li>
              <Link
                href="https://culture.decentrawood.com/"
                className={styles.heroDropdownItem}
              >
                Culture
              </Link>
            </li>
            {/* <li>
              <Link href="#" className={styles.heroDropdownItem}>
                Active Grants
              </Link>
            </li>
            <li>
              <Link href="#" className={styles.heroDropdownItem}>
                Dao Transparency
              </Link>
            </li>
            <li>
              <Link href="#" className={styles.heroDropdownItem}>
                Dao Grants
              </Link>
            </li> */}
            <li>
              <Link href="https://glamour.decentrawood.com/" className={styles.heroDropdownItem}>
                Glamour
              </Link>
            </li>
          </ul>
        </li>
        {/* <li>
          <a
            href="https://glamour.decentrawood.com/"
            className={styles.heroLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Glamour
          </a>
        </li>
        <li>
          <a
            href="https://culture.decentrawood.com/"
            className={styles.heroLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Culture
          </a>
        </li> */}
         <li>
          <a
            href="/socialzone"
            className={styles.heroLink}
            target="_blank"
            rel="noopener noreferrer"
          >
           Social Zone
          </a>
        </li>
        <li
          className={`${styles.heroDropdown} ${
            isHovered2 || openDropdown === "whitepaper" ? styles.show : ""
          }`}
          onMouseEnter={() => setIsHovered2(true)}
          onMouseLeave={() => setIsHovered2(false)}
        >
          <span
            className={`${styles.heroLink} ${styles.heroDropdownToggle}`}
            onClick={(e) => {
              if (window.innerWidth <= 1200) {
                setOpenDropdown(openDropdown === "whitepaper" ? null : "whitepaper");
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            Whitepaper
          </span>
           <ul
            className={`${styles.heroDropdownMenu} ${
              isHovered2 || openDropdown === "whitepaper" ? styles.show : ""
            }`}>
              <li>
                <a
                  href="/assets/pdf/WhitePaper.pdf"
                  className={styles.heroDropdownItem}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View PDF
                </a>
              </li>
              <Link
                href="/DeodToken"
                className={styles.heroDropdownItem}
              >
                DEOD Token
              </Link>
            </ul>
          </li>
        {/* <li>
          <a
            href="/assets/pdf/WhitePaper.pdf"
            className={styles.heroLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            White Paper
          </a>
        </li> */}

        {/* DAO dropdown */}
        <li
          className={`${styles.heroDropdown} ${
            isHovered || openDropdown === "dao" ? styles.show : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span
            className={`${styles.heroLink} ${styles.heroDropdownToggle}`}
            onClick={() => {
              if (window.innerWidth <= 1200) {
                setOpenDropdown(openDropdown === "dao" ? null : "dao");
              }
            }}
            style={{ cursor: "pointer" }}
          >
            DAO
          </span>
          <ul
            className={`${styles.heroDropdownMenu} ${
              isHovered || openDropdown === "dao" ? styles.show : ""
            }`}
          >
            <li>
              <Link href="/dao" className={styles.heroDropdownItem}>
                Overview
              </Link>
            </li>
            <li>
              <Link href="/dao/proposal" className={styles.heroDropdownItem}>
                Proposals
              </Link>
            </li>
            <li>
              <Link href="/dao/submit" className={styles.heroDropdownItem}>
                Submit Proposal
              </Link>
            </li>
          </ul>
        </li>

        <li>
          <Link href="/blog" className={styles.heroLink}>
            Blog
          </Link>
        </li>
        <li>
          <Link href="/news" className={styles.heroLink}>
            News
          </Link>
        </li>
        <li>
          <Link href="/community" className={styles.heroLink}>
            Community
          </Link>
        </li>
        <li>
          <Link href="/trade" className={styles.heroLink}>
            DEOD Token
          </Link>
        </li>
        <li className={styles.mobileNavItem}>
          <button
            className={`${styles.mobileMenuButton} ${styles.ctaPrimary1}`}
            onClick={() => {
              marketLink
                ? router.push("/marketdashboard")
                : router.push("/nftmarketdashboard");
            }}
          >
            Marketplace
          </button>
        </li>
        <li className={styles.mobileNavItem}>
          {mounted && loginReducer.isLogin ? (
            <div className="dropdown w-100 d-flex justify-content-center">
              <div 
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', backdropFilter: 'blur(4px)', margin: '0 auto', width: 'fit-content', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </div>
                <span style={{ color: 'white', fontWeight: '600', letterSpacing: '0.5px' }}>
                  {userName}
                </span>
                <i className="bi bi-chevron-down" style={{ color: 'white', fontSize: '12px', paddingRight: '5px' }}></i>
              </div>
              <ul className="dropdown-menu mt-2 text-center" style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', left: '50%', transform: 'translateX(-50%)' }}>
                <li>
                  <Link href="/marketdashboard/profile" className="dropdown-item text-white">
                    Profile
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                </li>
                <li>
                  <a className="dropdown-item text-danger" onClick={handleLogOut} style={{ cursor: 'pointer' }}>
                    Log Out
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <button
              className={`${styles.mobileMenuButton} ${styles.mobileMenuButtonSecondary}`}
              onClick={() => {
                router.push("/connectwallet");
              }}
            >
              Join
            </button>
          )}
        </li>
      </ul>

      {/* Actions */}
      <div className={styles.heroActions}>
        <button
          className={styles.ctaPrimary1}
          onClick={() => {
            marketLink
              ? router.push("/marketdashboard")
              : router.push("/nftmarketdashboard");
          }}
        >
          Marketplace
        </button>

        {mounted && loginReducer.isLogin ? (
          <div className="dropdown">
            <div 
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 16px 6px 6px', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', backdropFilter: 'blur(4px)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </div>
              <span style={{ color: 'white', fontWeight: '600', letterSpacing: '0.5px' }}>
                {userName}
              </span>
              <i className="bi bi-chevron-down" style={{ color: 'white', fontSize: '12px' }}></i>
            </div>
            <ul className="dropdown-menu dropdown-menu-end mt-2" style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <li>
                <Link href="/marketdashboard/profile" className="dropdown-item text-white">
                  Profile
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              </li>
              <li>
                <a className="dropdown-item text-danger" onClick={handleLogOut} style={{ cursor: 'pointer' }}>
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <button
            className={styles.heroPlayNow}
            onClick={() => {
              router.push("/connectwallet");
            }}
          >
            <span>Join</span>
            <span>Join</span>
          </button>
        )}
      </div>

      {/* Hamburger / Close */}
      <div
        className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>

    {/* Sidebar overlay */}
    <div
      className={`${styles.menuOverlay} ${menuOpen ? styles.menuOverlayActive : ""}`}
      onClick={() => setMenuOpen(false)}
    />

      {/* decentrawood Map modal */}
      <div
        className="modal fade"
        id="exampleModal2"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel2"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className={`modal-content ${styles.map_content}`}>
            <div className="modal-header border-0">
              <h5 className="modal-title" id="exampleModalLabel"></h5>
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
                <div className="col-12 text-center">
                  <div className={` ${styles.map_img_box2}`}>
                    <div className={` ${styles.map_img2}`}>
                      <img
                        src="/assets/uniswap.png"
                        className="img-fluid"
                        alt=""
                      />
                    </div>
                    <button className={` ${styles.map_btn}`}>Uniswap</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {hasRecognitionSupport && ( */}
      {/* <div
        className="d-flex align-items-center"
        style={{
          position: "fixed",
          bottom: "10%",
          right: "5%",
          zIndex: "1000",
          height: "50px",
        }}
      >
        {isListening && (
          <div className="my-auto text-white mx-2" style={{ zIndex: "10001" }}>
            {listeningText}
          </div>
        )}
        <div
          className={`d-flex align-items-center justify-content-center text-center ${styles.speak_btn}`}
          style={{
            width: "60px",
            height: "60px",
            backgroundImage: "linear-gradient(210deg,lightblue,purple)",
            borderRadius: "30px",
            cursor: "pointer",
            fontSize: "40px",
          }}
          onClick={startListening}
        >
          <i className="bi bi-robot "></i>
        </div>
        <div
          className={`bg-success text-white ${styles.inst_div}`}
          style={{
            borderRadius: "10px 10px 0 10px ",
            padding: "10px",
            position: "fixed",
            bottom: "15%",
            backgroundImage: "linear-gradient(to bottom right,blue, purple)",
            right: "10%",
            width: "350px",
            height: "150px",
            zIndex: "1000",
          }}
        >
          <div className="my-1 ">
            <strong>
              Tap{" "}
              <i className="bi bi-robot  text-black p-1 rounded rounded-circle"
              style={{backgroundImage: "linear-gradient(to bottom right,purple, pink)",}}
              ></i>{" "}
              to Speak
            </strong>
          </div>
          <div>
            Try Asking <strong>Hello ... </strong>
          </div>
          <div>
            Try Asking <strong>Open Marketplace ... </strong>
          </div>
          <div>
            Try Asking <strong>Can i Earn tokens  ...</strong>
          </div>
        </div>
      </div> */}
      <Chatbot />
      {/* )} */}
    </>
  );
};

export default Header;
