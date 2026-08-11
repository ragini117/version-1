import { useState, useEffect } from "react";
import styles from "./popupMessage.module.css";
import { useRouter } from "next/navigation";

// Reusable Popup Component
const Popup = ({ isVisibleAfter, onClose, children }) => {
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopup(true);
        }, isVisibleAfter);
        return () => clearTimeout(timer);
    }, [isVisibleAfter]);

    const handleClosePopup = () => {
        setShowPopup(false);
        if (onClose) onClose();
    };

    if (!showPopup) return null;

    return (
        <div className={styles.popup_container}>
            <div className={styles.popup_content_container}>
                {/* Gift Icon */}
                <img
                    src="assets/gift.png"
                    alt="Gift"
                    className={styles.popup_gift_icon}
                />

                {/* Close Button */}
                <button
                    className={styles.popup_close_btn}
                    onClick={handleClosePopup}
                >
                    ✖
                </button>

                {/* Content */}
                <div className={styles.popup_content}>{children}</div>

                {/* Button */}
                <a
                    className={styles.popup_button}
                    href="https://gleam.io/7w8aW/deod-bull-run-bounty-win-up-to-10000-deod"
                    style={{textDecoration: "none"}}
                    target="_blank"
                    // onClick={() => router.push("https://gleam.io/nRPIc/deod-bnb-chain-airdrop-is-live")}
                >
                    Sign Up Today!
                </a>
            </div>
        </div>
    );
};

export default Popup;
