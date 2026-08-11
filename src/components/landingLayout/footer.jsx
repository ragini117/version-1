"use client";
import React from "react";
import "aos/dist/aos.css";
// import styles from "../../app/page.module.css";
import Link from "next/link";
import heroStyles from "../landingSection/herosection.module.css";
const Footer = () => {
    return (
        <footer className={heroStyles.footer}>
            <div className={heroStyles.footerContainer}>
                {/* Left Section: Brand + Subscribe */}
                <div className={heroStyles.footerBrand}>
                    <h3 className={heroStyles.footerLogo}>
                        <img
                            src="/assets/logoicon.png"
                            alt=""
                            style={{ width: "60px" }}
                        />
                        Decentrawood
                    </h3>
                    {/* <form className={heroStyles.subscribeForm}>
            <input
              type="email"
              placeholder="Enter your email"
              className={heroStyles.subscribeInput}
            />
            <button type="submit" className={heroStyles.subscribeButton}>
              Subscribe
            </button>
          </form> */}
                </div>

                {/* Middle Section: Menu Links with headings */}
                <div className={heroStyles.footerLinks}>
                    <div>
                        <h4 className={heroStyles.footerHeading}>
                            Useful Link
                        </h4>
                        <ul>
                            <li>
                                <a href="">Home</a>
                            </li>
                            <li>
                                <a href="https://gaming.decentrawood.com/">
                                    Gaming
                                </a>
                            </li>
                            <li>
                                <a href="https://ai.decentrawood.com/">AI</a>
                            </li>
                            <li>
                                <a href="https://glamour.decentrawood.com">
                                    Metaverse
                                </a>
                            </li>
                            <li>
                                <a href="https://glamour.decentrawood.com">
                                    Glamour
                                </a>
                            </li>
                            <li>
                                <a href="https://culture.decentrawood.com">
                                    Culture
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className={heroStyles.footerHeading}>Resources</h4>
                        <ul>
                            <li>
                                <a href="/what-is-decentrawood">
                                    What is Decentrawood{" "}
                                </a>
                            </li>
                            <li>
                                <a href="/dao">Governance</a>
                            </li>
                            <li>
                                <a href="/news">News</a>
                            </li>
                            <li>
                                <a href="/blog">Blog</a>
                            </li>
                            <li>
                                <a href="./assets/pdf/WhitePaper.pdf">
                                    WhitePaper{" "}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        {/* <h4 className={heroStyles.footerHeading}>Company</h4> */}
                        {/* <ul>
          <li><a href="#"><img src=""/>
</a></li>
          <li><a href="https://medium.com"><img src="https://logos-world.net/wp-content/uploads/2020/11/Medium-Logo.png" alt="Medium" width="24" height="24"/></a></li>
          <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 1043.63 592.71">
  <path d="M588.67 296.36c0 163.62-132.85 296.38-296.38 296.38S-4.09 460 -4.09 296.36 128.76.0 292.3.0s296.38 132.85 296.38 296.36zM1043.63 296.36c0 163.62-132.85 296.38-296.38 296.38S450.87 460 450.87 296.36 583.72 0 747.26 0s296.38 132.85 296.38 296.36zM870 592.71H173.63V0H870v592.71z"/>
</svg>
</a></li>
          <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
   10-4.48 10-10S17.52 2 12 2zm3.07 13.25l-3.54-2.12-3.54
   2.12.67-4-2.86-2.78 3.95-.58L12 5.5l1.31 2.77
   3.95.58-2.86 2.78.67 4z"/>
</svg></a></li>
<li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 601 601">
  <path d="M300.5 0C134.9 0 0 134.9 0 300.5s134.9 300.5 300.5 300.5S601 466.1 601 300.5 466.1 0 300.5 0zM411.1 378.8c-10.4
    21.5-30.8 36.5-54.8 40.4-43.7 7.8-88.4-19.5-96.1-63.2-5.9-30.8 7.1-60.7 30.3-77.7 23.2-17 54.3-18.1 78-3.8
    23.7 14.3 37.7 38.6 35.3 65.6-1.2 14.2-6.4 27.9-14.9 39.4z"/>
</svg></a></li>

        </ul> */}
                    </div>
                    <div>
                        <h4 className={heroStyles.footerHeading}>Socials</h4>
                        <ul>
                            <li>
                                <a
                                    href="https://www.twitter.com/decentrawood"
                                    aria-label="Twitter"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.88-2.36 8.59 8.59 0 0 1-2.72 1.04A4.23 4.23 0 0 0 16.1 4c-2.34 0-4.23 1.9-4.23 4.24 0 .33.04.65.1.95-3.52-.18-6.65-1.86-8.74-4.42a4.26 4.26 0 0 0-.57 2.13c0 1.47.74 2.76 1.87 3.52a4.23 4.23 0 0 1-1.91-.53v.05c0 2.06 1.47 3.78 3.42 4.17a4.3 4.3 0 0 1-1.9.07c.54 1.7 2.1 2.93 3.95 2.97A8.49 8.49 0 0 1 2 19.54a11.9 11.9 0 0 0 6.44 1.89c7.73 0 11.95-6.41 11.95-11.96 0-.18 0-.35-.01-.53A8.56 8.56 0 0 0 22.46 6z" />
                                    </svg>
                                    Twitter{" "}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.facebook.com/decentrawood"
                                    aria-label="Facebook"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-2.9h2v-2.2c0-2 1.2-3.2 3-3.2.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2v2h2.3L15 14.9h-2v7A10 10 0 0 0 22 12" />
                                    </svg>{" "}
                                    Facebook
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.instagram.com/decentrawood_gaming/?igsh=MWVxdHZuZjFvNHR2cA%3D%3D"
                                    aria-label="Instagram"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.5-.8a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z" />
                                    </svg>{" "}
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://t.me/decentrawoodDisscussion"
                                    aria-label="Telegram"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12C24 5.373 18.627 0 12 0zm5.153 8.588l-1.945 9.172c-.147.655-.529.817-1.072.509l-2.968-2.185-1.431 1.377c-.158.158-.29.29-.595.29l.213-3.007 5.482-4.958c.238-.213-.052-.332-.37-.12l-6.78 4.265-2.92-.912c-.635-.199-.648-.635.133-.94l11.392-4.392c.529-.199.995.12.82.94z" />
                                    </svg>
                                    Telegram
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://discord.com/invite/decentrawood"
                                    aria-label="Discord"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.522 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                                    </svg>
                                    Discord
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
