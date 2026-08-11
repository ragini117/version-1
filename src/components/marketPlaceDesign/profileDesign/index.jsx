"use client";
import { useEffect, useState } from "react";
import styles from "./profileDesign.module.css";
import axios from "axios";
import { apiUrl } from "../../../../environment";
import CopyToClipboard from "react-copy-to-clipboard";
import AssetCard from "./AssetCard";
import Newsletter from "./Newsletter";
import ProfileBanner from "./ProfileBanner";
import Navbar from "./Navbar";
import Modal from "./Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../loaderDesign/index";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getVotingPowerBreakdown } from "../../daoDesign/votingPower";
import { Web3Provider } from "@ethersproject/providers";
const page = () => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [assetCode, setAssetCode] = useState(0);
  const [assetCategory, setAssetCategory] = useState("Digital Art");
  const [activeTab, setActiveTab] = useState("my-proposals");
  const [sellData, setSellData] = useState({});
  const [vpData, setVpData] = useState(null);
  const [vpLoading, setVpLoading] = useState(false);
  const router = useRouter();

  const handleProfileData = async () => {
    setLoading(true);
      const yourToken = localStorage.getItem('_auth_token')
    try {
      const resp = await axios(`${apiUrl}/asset/getProfileAssets`, 
        {
            headers: {
            Authorization: `Bearer ${yourToken}`,
          }
        });
      // console.log(resp,"profileData")
      if (resp?.status === 200) {
        setProfileData(resp.data.data);
        console.log(resp.data.data)
      }
    } catch (error) {
      console.log(error, "Error in profile");
    }
    setLoading(false);
  };
  const toggleAssetCode = async (number, category) => {
    setAssetCode(number);
    setAssetCategory(category);
  };
  const start_and_end = (address, length) => {
    if (address !== undefined) {
      return (
        address.substr(0, length) +
        "...." +
        address.substr(address.length - length, address.length)
      );
    }
    return address;
  };
  const handleCopy = async () => {
    alert("copied");
  };
  const claimCoupons = async () => {
    // alert("Coming Soon")
    setLoading(true)
    try {
      const resp = await axios.post(`${apiUrl}/colorPrd/claim-coupon`)
      console.log(resp.data)
      toast.success(resp.data.message)
      setTimeout(() => {
       window.location.reload()
      }, 3000);

    } catch (error) {
      console.log(error)
      toast.error('Error Claiming Coupon')
    }
    setLoading(false)
  }
  const fetchVotingPower = async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) return;
      const address = localStorage.getItem("address");
      if (!address) return;
      setVpLoading(true);
      const web3 = new Web3Provider(window.ethereum);
      const blockNumber = await web3.getBlockNumber();
      const breakdown = await getVotingPowerBreakdown(address, blockNumber);
      setVpData(breakdown);
    } catch (err) {
      console.error("Error fetching voting power:", err);
    } finally {
      setVpLoading(false);
    }
  };

  useEffect(() => {
    handleProfileData();
    fetchVotingPower();
  }, []);

  const statusBadge = (status) => ({
    background: status === "Active" ? "rgba(40,167,69,0.15)" : status === "Closed" ? "rgba(108,117,125,0.15)" : "rgba(255,193,7,0.15)",
    color: status === "Active" ? "#4ade80" : status === "Closed" ? "#9ca3af" : "#fbbf24",
    border: `1px solid ${status === "Active" ? "rgba(40,167,69,0.3)" : status === "Closed" ? "rgba(108,117,125,0.3)" : "rgba(255,193,7,0.3)"}`,
    fontWeight: "600",
    letterSpacing: "0.5px",
  });

  const DateRow = ({ icon, color, bg, label, date }) => (
    <div className="d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-2">
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className={icon} style={{ color, fontSize: 12 }} />
        </div>
        <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#9ca3af" }}>{label}</span>
      </div>
      <span style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f0" }}>{new Date(date).toLocaleDateString()}</span>
    </div>
  );

  const ProposalCard = ({ proposal, cardClass, accentBg, accentBorder, dotGrad, typeColor }) => (
    <div className={cardClass}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h5 style={{ color: "#f1f5f9", fontWeight: 700, lineHeight: 1.4, marginBottom: 0, fontSize: "15px" }}>{proposal.modelName || proposal.userName}</h5>
        <span className="badge rounded-pill px-3 py-2 ms-2" style={statusBadge(proposal.status)}>{proposal.status}</span>
      </div>
      <div className="d-flex align-items-center gap-2 p-2 rounded-3 mb-3" style={{ background: accentBg, border: accentBorder }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotGrad, boxShadow: "0 0 6px currentColor" }} />
        <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#9ca3af" }}>Type</span>
        <span className="ms-auto" style={{ fontSize: "13px", fontWeight: 600, color: typeColor }}>{proposal.type}</span>
      </div>
      <div className="d-flex flex-column gap-2 pt-3" style={{ borderTop: accentBorder }}>
        <DateRow icon="bi bi-calendar-event" color={typeColor} bg={accentBg} label="Start" date={proposal.startDate} />
        <DateRow icon="bi bi-calendar2-check" color={typeColor} bg={accentBg} label="End" date={proposal.endDate} />
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      {loading && <Loader />}
      <div className={styles.inner}>

      <ProfileBanner
        profileData={profileData}
        handleCopy={handleCopy}
        start_and_end={start_and_end}
        claimCoupons={claimCoupons}
        vpData={vpData}
        vpLoading={vpLoading}
        onWalletConnected={() => { handleProfileData(); fetchVotingPower(); }}
      />

      {/* Tabs */}
      <div className={styles.tabRow}>
        {["MY PROPOSALS", "MY VOTES"].map((tab) => {
          const key = tab.toLowerCase().replace(" ", "-");
          return (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === key ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab(key)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Proposals */}
      {activeTab === "my-proposals" && (
        profileData?.myProposals?.length > 0 ? (
          <div className="row g-4 mb-4">
            {profileData.myProposals.map((proposal, index) => (
              <div className="col-12 col-md-6 col-lg-4" key={index}>
                <ProposalCard
                  proposal={proposal}
                  cardClass={styles.proposalCard}
                  accentBg="rgba(168,85,247,0.07)"
                  accentBorder="1px solid rgba(168,85,247,0.12)"
                  dotGrad="linear-gradient(135deg,#a855f7,#6d28d9)"
                  typeColor="#c4b5fd"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><i className="bi bi-inbox" /></div>
            <h5 style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: "0.5rem" }}>No Proposals Yet</h5>
            <p style={{ color: "#9ca3af", marginBottom: 0 }}>You haven't made any proposals yet.</p>
          </div>
        )
      )}

      {/* Votes */}
      {activeTab === "my-votes" && (
        profileData?.myVotes?.length > 0 ? (
          <div className="row g-4 mb-4">
            {profileData.myVotes.map(({ proposal }, index) => (
              <div className="col-12 col-md-6 col-lg-4" key={index}>
                <ProposalCard
                  proposal={proposal}
                  cardClass={styles.voteCard}
                  accentBg="rgba(99,102,241,0.07)"
                  accentBorder="1px solid rgba(99,102,241,0.12)"
                  dotGrad="linear-gradient(135deg,#6366f1,#4338ca)"
                  typeColor="#a5b4fc"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><i className="bi bi-envelope-open" /></div>
            <h5 style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: "0.5rem" }}>No Votes Yet</h5>
            <p style={{ color: "#9ca3af", marginBottom: 0 }}>You haven't cast any votes yet.</p>
          </div>
        )
      )}

      {/* Assets */}
      <Navbar toggleAssetCode={toggleAssetCode} assetCode={assetCode} />
      <div className="row py-2 justify-content-center">
        <div className="col-md-9">
          {profileData?.assets?.map((data, index) => {
            if (data.category === assetCategory) {
              return (
                <div key={index} onClick={() => setSellData(data)}>
                  <AssetCard data={data} sellData={sellData} />
                </div>
              );
            }
          })}
        </div>
      </div>

      </div>
      <Modal sellData={sellData} />
      <ToastContainer />
    </div>
  );
};
export default page;
