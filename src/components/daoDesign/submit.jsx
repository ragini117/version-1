"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiNetworkChart, BiMap } from "react-icons/bi";
import { TbBan } from "react-icons/tb";
import { HiOutlineRectangleStack } from "react-icons/hi2";
import { RiRemoteControlLine } from "react-icons/ri";
import { MdOutlinePoll } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import styles from "../../components/daoDesign/submit.module.css";
import Modal from "./Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { multiSignContract, multiSignContractAbi } from "@/abi/Abi";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
const proposals = [
  {
    title: "Model Build",
    description: "Add or remove a node to the decentralized network of community-run content servers",
    accent: "#60a5fa",
    accentRgb: "96,165,250",
    icon: <BiNetworkChart />,
    modalActions: ["Add"],
    comingSoon: true,
  },
  {
    title: "Point of Interest",
    description: "Highlight a noteworthy Decentrawood location on the map for others to find",
    accent: "#34d399",
    accentRgb: "52,211,153",
    icon: <BiMap />,
    modalActions: ["Add", "Remove"],
  },
  {
    title: "Name Ban",
    description: "Ban an offensive name from Decentrawood",
    accent: "#f87171",
    accentRgb: "248,113,113",
    icon: <TbBan />,
    modalActions: ["Add", "Remove"],
  },
  {
    title: "Hiring",
    description: "Request a Community member to be added or removed from a Committee",
    accent: "#2dd4bf",
    accentRgb: "45,212,191",
    icon: <HiOutlineRectangleStack />,
    modalActions: ["Add", "Remove"],
  },
  {
    title: "Grant Request",
    description: "Request funding from the DAO for a project or contribution",
    accent: "#a78bfa",
    accentRgb: "167,139,250",
    icon: <RiRemoteControlLine />,
    modalActions: ["Submit", "Withdraw"],
    comingSoon: true,
  },
  {
    title: "Poll",
    description: "Create a community poll to gather opinions from DAO members",
    accent: "#fbbf24",
    accentRgb: "251,191,36",
    icon: <MdOutlinePoll />,
    modalActions: ["Create"],
  },
];

const Submit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminAddresses, setAdminAddresses] = useState([]);
  const [address, setAddress] = useState(null);
  const [currentProposal, setCurrentProposal] = useState(null);
  const [showHiringSection, setShowHiringSection] = useState(true);
  const router = useRouter();
  const { loginReducer } = useSelector((res) => res);
  // console.log("adminAddresses",adminAddresses.length);

  const handleCardClick = (proposal) => {
    if (proposal.comingSoon) return;

    if (!loginReducer?.isLogin) {
      toast.error("Please login first to create a proposal.");
      router.push("/login");
      return;
    }

    if (!loginReducer?.userDetail?.accountId && !localStorage.getItem("address")) {
      toast.error("Please connect your wallet address in your profile before creating a proposal.");
      return;
    }

    if (proposal.title === "Model Build" || proposal.title === "Poll") {
      const action = proposal.modalActions[0];
      handleModalAction(action, proposal.title);
    } else {
      setCurrentProposal(proposal);
      setIsModalOpen(true);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProposal(null);
  };

  const handleModalAction = (action, title) => {
    const proposalTitle = title || currentProposal.title;

    switch (proposalTitle) {
      case "Name Ban":
        if (action === "Add") {
          router.push(`/dao/submit/nameBanAdd`);
        } else if (action === "Remove") {
          router.push(`/dao/submit/nameBanRemove`);
        }
        break;
      case "Model Build":
        router.push(`/dao/submit/modelAdd`);
        break;
      case "Point of Interest":
        if (action === "Add") {
          router.push(`/dao/submit/poiAdd`);
        } else if (action === "Remove") {
          router.push(`/dao/submit/poiRemove`);
        }
        break;
      case "Hiring":
        if (action === "Add") {
          router.push(`/dao/submit/hiringAdd`);
        } else if (action === "Remove") {
          router.push(`/dao/submit/hiringRemove`);
        }
        break;
      case "Poll":
        router.push(`/dao/submit/pollAdd`);
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    router.push("/dao/proposal");
  };
  const checkDaoAddress = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const daoMember = new ethers.Contract(
        multiSignContract,
        multiSignContractAbi,
        signer
      );

      const adminAddresses = await daoMember.getDAOMembers();
      const lowercaseAddresses = adminAddresses.map((address) =>
        address.toLowerCase()
      );
      setAdminAddresses(lowercaseAddresses);

      if (lowercaseAddresses.length >= 3) {
        setShowHiringSection(false);
        console.log("inside remove");
      } else {
        setShowHiringSection(true);
        console.log("inside add");
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
      // toast.error("Error fetching DAO addresses. Please try again.");
    }
  };

  useEffect(() => {
    // Retrieve the address from localStorage
    const storedAddress = localStorage.getItem("address");
    if (storedAddress) {
      setAddress(storedAddress.toLowerCase());
    }
  }, []); // Run this only once on component mount

  useEffect(() => {
    if (address) {
      checkDaoAddress();
    }
  }, [address]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <div onClick={handleBack} className={styles.backBtn}>
            <i className="bi bi-arrow-left"></i>
          </div>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Submit Proposal</h1>
            <p className={styles.subtitle}>Select a proposal category to get started</p>
          </div>
        </div>

        <div className={styles.proposalsList}>
          {proposals.map((proposal, index) => (
            <div
              key={index}
              className={`${styles.proposalCard} ${proposal.comingSoon ? styles.comingSoonCard : ""}`}
              style={{ "--accent": proposal.accent, "--accent-rgb": proposal.accentRgb }}
              onClick={() => handleCardClick(proposal)}
            >
              <div className={styles.title_icon}>
                <div className={styles.iconWrapper}>{proposal.icon}</div>
                <div>
                  <h3 className={styles.proposalTitle}>{proposal.title}</h3>
                  <p className={styles.proposalDescription}>{proposal.description}</p>
                </div>
              </div>
              <div className={styles.cardRight}>
                {proposal.comingSoon && (
                  <span className={styles.comingSoon}>Coming Soon</span>
                )}
                {!proposal.comingSoon && (
                  <MdArrowForwardIos className={styles.cardArrow} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <Modal
          proposal={currentProposal}
          onClose={handleCloseModal}
          onAction={(action) => handleModalAction(action)}
          adminAddresses={adminAddresses}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Submit;
