import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import styles from "./profileDesign.module.css";
import { ethers } from "ethers";
import axios from "axios";
import { apiUrl } from "../../../../environment";
import { toast } from "react-toastify";

const ProfileBanner = ({ profileData, handleCopy, start_and_end, claimCoupons, vpData, vpLoading, onWalletConnected }) => {
  async function handleMetamask() {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask not found. Please install MetaMask.");
        return;
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const message = ["Welcome to the Decentrawood Dashboard!", "Please sign this message to verify your identity."].join("\n\n");
      await signer.signMessage(message);
      const address = (await signer.getAddress()).toLowerCase();
      const response = await axios.post(`${apiUrl}/users/addAccountID`, { accountId: address, username: profileData.userName });

      if (response.data?.status === "notOk") {
        toast.error(response.data.message || "Failed to connect wallet.");
      } else {
        localStorage.setItem("address", address);
        toast.success("Wallet connected!");
        onWalletConnected?.();
      }
    } catch (err) {
      console.log("Wallet error", err);
      toast.error(err?.response?.data?.message || "Error connecting wallet. Please try again.");
    }
  }

  return (
    <div className={styles.banner}>
      {/* Cover */}
      <div className={styles.cover} />

      {/* Body */}
      <div className={styles.profileBody}>
        {/* Avatar + name (left) / VP badge (right) */}
        <div className={styles.profileHead}>
          <div className={styles.profileLeft}>
            <div className={styles.avatarRing}>
              <img src={profileData?.profilePic || "/assets/Pic-3.png"} alt="avatar" className={styles.avatarImg} />
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.username}>@{profileData?.userName || "—"}</div>
              <div className={styles.addressLine}>
                <span>{start_and_end(profileData?.userAccount, 8) || "No wallet"}</span>
                {profileData?.userAccount && (
                  <CopyToClipboard text={profileData?.userAccount} onCopy={handleCopy}>
                    <button className={styles.copyBtn}><i className="fa-solid fa-clone" /></button>
                  </CopyToClipboard>
                )}
              </div>
            </div>
          </div>

          {/* Voting Power Badge */}
          <div className={styles.vpBadge}>
            <div className={styles.vpBadgeIcon}>
              <i className="bi bi-lightning-charge-fill" />
            </div>
            <div className={styles.vpBadgeText}>
              <div className={styles.vpBadgeLabel}>Voting Power</div>
              <div className={styles.vpBadgeValue}>
                {vpLoading ? (
                  <span style={{ fontSize: "0.9rem", color: "#9ca3af" }}>…</span>
                ) : vpData !== null ? (
                  <>{Math.floor(vpData.total).toLocaleString()}<span className={styles.vpBadgeUnit}>VP</span></>
                ) : (
                  <>—<span className={styles.vpBadgeUnit}>VP</span></>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className={styles.statsBar}>
          {/* Referral */}
          {profileData?.userAccount ? (
            <div className={styles.statItem}>
              <div className={styles.statIcon} style={{ background: "rgba(168,85,247,0.12)" }}>
                <i className="bi bi-link-45deg" style={{ color: "#c084fc" }} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>My Referral</div>
                <div className={styles.statVal}>
                  {start_and_end(`https://decentrawood.com/metawallet?referral=${profileData?.userAccount}`, 14)}
                </div>
              </div>
              <CopyToClipboard text={`https://decentrawood.com/metawallet?referral=${profileData?.userAccount}`} onCopy={handleCopy}>
                <button className={styles.copyBtn}><i className="fa-solid fa-clone" /></button>
              </CopyToClipboard>
            </div>
          ) : (
            <div className={styles.statItem} style={{ cursor: "pointer" }} onClick={handleMetamask}>
              <div className={styles.statIcon} style={{ background: "rgba(168,85,247,0.12)" }}>
                <i className="bi bi-wallet2" style={{ color: "#c084fc" }} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Wallet</div>
                <div className={styles.statVal}>Add wallet — earn 1000 DEOD</div>
              </div>
            </div>
          )}

          {/* Referred by */}
          <div className={styles.statItem}>
            <div className={styles.statIcon} style={{ background: "rgba(99,102,241,0.12)" }}>
              <i className="bi bi-person-check" style={{ color: "#818cf8" }} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Referred By</div>
              <div className={styles.statVal}>{start_and_end(profileData?.referredBy, 8) || "—"}</div>
            </div>
            {profileData?.referredBy && (
              <CopyToClipboard text={profileData?.referredBy} onCopy={handleCopy}>
                <button className={styles.copyBtn}><i className="fa-solid fa-clone" /></button>
              </CopyToClipboard>
            )}
          </div>

          {/* Android key */}
          <div className={styles.statItem}>
            <div className={styles.statIcon} style={{ background: "rgba(52,211,153,0.12)" }}>
              <i className="bi bi-android2" style={{ color: "#34d399" }} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Android Key</div>
              <div className={styles.statVal}>{profileData?.androidKey || "—"}</div>
            </div>
            {profileData?.androidKey && (
              <CopyToClipboard text={profileData?.androidKey} onCopy={handleCopy}>
                <button className={styles.copyBtn}><i className="fa-solid fa-clone" /></button>
              </CopyToClipboard>
            )}
          </div>
        </div>

        {/* VP Breakdown */}
        {!vpLoading && vpData && (
          <div className={styles.vpBreakdown}>
            <div className={styles.vpBreakdownTitle}>
              <i className="bi bi-bar-chart-fill" /> Voting Power Sources
            </div>
            <div className={styles.vpBreakdownRows}>
              {/* DEOD row */}
              <div className={styles.vpBreakdownRow}>
                <div className={styles.vpBreakdownSource}>
                  <span className={styles.vpBreakdownDot} style={{ background: "#f59e0b" }} />
                  <span>DEOD Holdings</span>
                </div>
                <div className={styles.vpBreakdownMid}>
                  {vpData.deodBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} DEOD
                </div>
                <div className={styles.vpBreakdownVp}>
                  {Math.floor(vpData.deodVP).toLocaleString()} VP
                </div>
              </div>

              {/* Parcel rows — only shown if user holds NFTs */}
              {vpData.parcels.map((p) => (
                <div key={p.category} className={styles.vpBreakdownRow}>
                  <div className={styles.vpBreakdownSource}>
                    <span className={styles.vpBreakdownDot} style={{ background: "#a855f7" }} />
                    <span>{p.category} Parcel <span className={styles.vpBreakdownCount}>×{p.count}</span></span>
                  </div>
                  <div className={styles.vpBreakdownMid}>
                    <span className={styles.vpExtraTag}>+{p.vpPerToken.toLocaleString()} VP each</span>
                  </div>
                  <div className={styles.vpBreakdownVp} style={{ color: "#c084fc" }}>
                    +{p.totalVp.toLocaleString()} VP
                  </div>
                </div>
              ))}

              {/* Hint when no parcels */}
              {!vpData.hasParcels && (
                <div className={styles.vpNoParcels}>
                  <i className="bi bi-info-circle" />
                  Own a land parcel NFT to earn bonus voting power (up to +25,000 VP per Mega parcel)
                </div>
              )}
            </div>
          </div>
        )}

        {/* Claim coupon */}
        {!profileData?.isClaimed && profileData?.couponAmount && (
          <div className={styles.claimBadge}>
            <i className="bi bi-gift-fill" />
            Coupon: <strong>{profileData?.couponAmount} DEOD</strong>
            <button className={styles.claimBtn} onClick={claimCoupons}>Claim Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBanner;
