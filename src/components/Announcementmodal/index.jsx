"use client";

import { useEffect, useState } from "react";
import styles from "../Announcementmodal/announcement.module.css";

const AnnouncementModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(true); // Show popup on page load
    }, []);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className={styles.closeButton}
                >
                    ✕
                </button>

                <h2 className={styles.title}>
                    🚀 Migration Update: DEOD Smart Contract Upgrade is LIVE
                </h2>

                <p className={styles.paragraph}>
                    The DEOD smart contract upgrade is now complete. We have
                    successfully moved to a more secure architecture to protect
                    our community and ensure long-term ecosystem stability.
                </p>

                {/* <p className={styles.paragraph}>
          Following the identification of <strong>irregular activity linked to specific wallets</strong>
         , in coordination with ecosystem partners, have taken immediate action to safeguard the DEOD token and its holders.

        </p> */}

                <h3 className={styles.sectionTitle}>
                    ✅ New Official Contract Address
                </h3>
                <p className={styles.paragraph}>
                    The new Liquidity Contract Address for the swap is now live. Please use only the address below:
                </p>
                <quote className={styles.quote}>
                    0x185d73EC966d464A40372cd7E737bB68B0B95f1f
                </quote>
                {/* <ul className={styles.list}>
                    <li>Enhanced security architecture</li>
                    <li>Greater resilience against future exploits</li>
                    <li>Stronger foundation for future ecosystem features</li>
                </ul> */}

                {/* <p className={styles.paragraph}>
                   
                </p> */}

                <h3 className={styles.sectionTitle}>🔄 Migration & Swap Details</h3>

                <ul className={styles.list}>
                    <li> <strong>Snapshot Complete:</strong> All legitimate holders have been recorded.</li>
                    <li> <strong>Protection:</strong> Holders are fully protected via our snapshot and swap-based distribution mechanism.</li>
                    <li> <strong>Security:</strong> Malicious or compromised wallets identified during the irregular activity have been excluded.</li>
                    <li> <strong>Next Steps:</strong> Follow the official migration dashboard or wait for the automated distribution to your wallet.</li>
                </ul>

                {/* <p className={styles.paragraph}>
                    This process is expected to complete within{" "}
                    <strong>96 hours</strong>.
                </p> */}

                <h3 className={styles.sectionTitle}>
                    ⚠️ Safety Reminder
                </h3>

                <ul className={styles.list}>
                    <li><strong>Do not</strong> interact with the old contract address.</li>
                    <li>
                        <strong>Only trust</strong> information from the official Decentrawood website and verified social channels.
                    </li>
                    <li>
                        <strong>Support:</strong> If you have questions regarding your specific allocation, please contact our official support team.
                    </li>
                </ul>

                {/* <h3 className={styles.sectionTitle}>🌱 Looking Ahead</h3>

                <p className={styles.paragraph}>
                    This upgrade marks an important step in strengthening
                    Decentrawood’s ecosystem as we continue expanding across:
                </p>

                <ul className={styles.list}>
                    <li>AI-powered experiences</li>
                    <li>Gaming & metaverse innovation</li>
                    <li>Creator-owned assets and utilities</li>
                </ul>

                <p className={styles.paragraph}>
                    We thank our community for its patience, trust, and
                    continued support.
                </p> */}

                <p className={styles.paragraph}>
                    <strong>Thank you for your patience as we strengthen the Decentrawood ecosystem for the future of AI, gaming, and the metaverse.</strong>
                </p>

                {/* <p className={styles.paragraph}>
                    🔊 Further updates will be shared soon.
                </p> */}  

                <p className={styles.footer}>— Team Decentrawood</p>
            </div>
        </div>
    );
};

export { AnnouncementModal };
