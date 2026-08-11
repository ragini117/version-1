import React, { useState } from "react";
import styles from "./deodtoken.module.css";

const DepositDeodOnMexc = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [trxHash, setTrxHash] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState("");

  const handleDeposit = async () => {
    if (!walletAddress.trim() || !trxHash.trim() || !telegramUsername.trim()) {
      setStatus("error");
      setMessage("Please fill in all fields before submitting.");
      return;
    }

    setLoading(true);
    setStatus(null);
    setMessage("");

    try {
      const res = await fetch("https://backend.decentrawood.com/depositeDeodMXE", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: walletAddress.trim(),
          transactionHash: trxHash.trim(),
          telegramId: telegramUsername.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Deposit submitted successfully! Rewards will be processed shortly.");
        setWalletAddress("");
        setTrxHash("");
        setTelegramUsername("");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className={styles.container}>
      <div className={styles.depositCard}>

        {/* Header */}
        <div className={styles.depositHeader}>
          <div className={styles.depositIconWrapper}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 className={styles.depositTitle}>Deposit DEOD on MEXC</h1>
            <p className={styles.depositSubtitle}>Fill in the details below to earn your rewards</p>
          </div>
        </div>

        <div className={styles.depositDivider} />

        {/* Form */}
        <div className={styles.depositForm}>

          <div className={styles.depositField}>
            <label className={styles.depositLabel}>
              <span className={styles.depositLabelIcon}>💳</span>
              Wallet Address
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x1234...abcd"
              className={styles.depositInput}
            />
          </div>

          <div className={styles.depositField}>
            <label className={styles.depositLabel}>
              <span className={styles.depositLabelIcon}>🔗</span>
              Transaction Hash
            </label>
            <input
              type="text"
              value={trxHash}
              onChange={(e) => setTrxHash(e.target.value)}
              placeholder="0xabc123..."
              className={styles.depositInput}
            />
          </div>

          <div className={styles.depositField}>
            <label className={styles.depositLabel}>
              <span className={styles.depositLabelIcon}>✈️</span>
              Telegram Username
            </label>
            <input
              type="text"
              value={telegramUsername}
              onChange={(e) => setTelegramUsername(e.target.value)}
              placeholder="@yourusername"
              className={styles.depositInput}
            />
          </div>

          {status && (
            <div className={status === "success" ? styles.depositSuccess : styles.depositError}>
              {status === "success" ? "✅ " : "⚠️ "}
              {message}
            </div>
          )}

          <button
            className={styles.depositBtn}
            onClick={handleDeposit}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.depositBtnSpinner} />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                Submit 
              </>
            )}
          </button>
        </div>

      </div>
    </main>
  );
};

export default DepositDeodOnMexc;
