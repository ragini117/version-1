"use client";
import React, { useEffect, useState } from "react";
import styles from "./proposal.module.css";
import { useRouter } from "next/navigation";
import { Web3Provider } from "@ethersproject/providers";
import Link from "next/link";
import axios from "axios";
import { multiSignContract, multiSignContractAbi } from "@/abi/Abi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import Head from "next/head";
import {
  MdLocationOn,
  MdBuild,
  MdBlock,
  MdWork,
  MdAssignment,
  MdHowToVote,
} from "react-icons/md";
const Proposal = () => {
  const { loginReducer } = useSelector((res) => res);
  const [proposals, setProposals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(15);
  const [adminAddresses, setAdminAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const fetchProposals = async (url) => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      if (response.data.status) {
        const fetchedProposals = response.data.data;
        const updatedProposals = fetchedProposals.map((proposal) => {
          const startDate = new Date(proposal.startDate);
          const endDate = new Date(proposal.endDate);
          const durationMs = endDate - startDate;
          const durationDays = durationMs / (1000 * 60 * 60 * 24);
          const currentDate = new Date();
          const remainingMs = endDate - currentDate;
          const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
          return {
            ...proposal,
            durationDays: durationDays,
            remainingDays: remainingDays,
          };
        });
        setProposals(updatedProposals);
        setTotalPages(response?.data?.pagination?.totalPages);
      } else {
        console.error("Failed to fetch proposals:", response.data.message);
        toast.error("Failed to fetch proposals. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast.error("Error fetching proposals. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const fetchAllProposals = async () => {
    setLoading(true);
    try {
      const account = localStorage.getItem("address");
      if (!account) {
        await fetchProposals("/DAO/getAllProposal");
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const daoMember = new ethers.Contract(
          multiSignContract,
          multiSignContractAbi,
          signer
        );
        const adminAddresses = await daoMember.getDAOMembers();
        const lowercaseAddresses = adminAddresses.map((a) => a.toLowerCase());
        setAdminAddresses(lowercaseAddresses);

        if (lowercaseAddresses.includes(account)) {
          await fetchProposals(`/DAO/get-admin-proposal?accountId=${account}`);
        } else {
          await fetchProposals("/DAO/getAllProposal");
        }
      } catch {
        // MetaMask not connected or contract call failed — just show all proposals
        await fetchProposals("/DAO/getAllProposal");
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast.error("Error fetching proposals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const maxPagesToShow = 5;
  const start = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
  const end = Math.min(start + maxPagesToShow - 1, totalPages);
  const getStatusText = (proposal) => {
    if (proposal.status === "Passed") {
      return (
        <p className={`${styles.status} ${styles.passed}`}>
          Status: Passed - Ended on{" "}
          {new Date(proposal.endDate).toLocaleDateString()}
        </p>
      );
    } else {
      return (
        <p className={`${styles.status} ${styles.active}`}>
          Status: Active - Ends on{" "}
          {new Date(proposal.endDate).toLocaleDateString()}
        </p>
      );
    }
  };

  const handleProposalDetail = (id) => {
    router.push(`/dao/proposal/proposalDetail/${id}`);
  };

  const handleProposalClick = async (type) => {
    setLoading(true); // Show loader
    try {
      let url;
      if (type === "all") {
        url = "/DAO/getAllProposal";
      } else {
        url = `/DAO/proposals?type=${type}`;
      }

      const response = await axios.get(url);
      const fetchedProposals = response.data.data;
        const updatedProposals = fetchedProposals.map((proposal) => {
          const startDate = new Date(proposal.startDate);
          const endDate = new Date(proposal.endDate);
          const durationMs = endDate - startDate;
          const durationDays = durationMs / (1000 * 60 * 60 * 24);
          const currentDate = new Date();
          const remainingMs = endDate - currentDate;
          const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
          return {
            ...proposal,
            durationDays: durationDays,
            remainingDays: remainingDays,
          };
        });
      if (response.data.status) {
        setProposals(updatedProposals);
        setTotalPages(response?.data?.pagination?.totalPages || 1);
        setCurrentPage(response?.data?.pagination?.currentPage || 1);
        router.push(`/dao/proposal?type=${type}`);
      } else {
        console.error("Failed to fetch proposals:", response.data.message);
        toast.error("Failed to fetch proposals. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast.error("Error fetching proposals. Please try again.");
    }
      setLoading(false); // Hide loader once navigation is complete
  };
  const handlePageChange = async (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      await fetchProposals(`/DAO/proposals?page=${page}`);
    }
  };
  const handleClick = () => {
    setLoading(true); // Show loader
    router.push('/dao/submit')
      setLoading(false); // Hide loader once navigation is complete
  };
  const handleAdmin = async () => {
    try {
      const web3 = new Web3Provider(window.ethereum);

      if (!web3) {
        throw new Error("MetaMask not detected");
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.listAccounts();
      const account = accounts[0];
      localStorage.setItem("account", account);
      toast.info("new account connected!");
      fetchAllProposals();
    } catch (error) {
      console.error("Error connecting wallet:", error.message);
      throw error;
    }
  };
  const handleProposalAction = (action, index) => {
    console.log(`Action: ${action}, Proposal Index: ${index}`);
  };

  useEffect(() => {
    fetchAllProposals();
  }, [currentPage]);

  useEffect(() => {
    if (loginReducer?.isLogin) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${loginReducer?.userDetail?.token}`;
    }
  }, [loginReducer]);

  return (
    <>
      <Head>
        <title>Decentrawood DAO Proposal - Shape the Future of the Metaverse</title>
        <meta name="description" content={`Join Decentrawood’s decentralised community and participate in shaping the metaverse through DAO proposals. `} />
      </Head>
      <div className={`container-fluid ${styles.pageWrapper}`}>
        <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link
                  className={`nav-link ${styles.navbar_cus_item}`}
                  href="/dao/"
                >
                  DAO Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${styles.navbar_cus_item}`}
                  href="/dao/proposal/proposalDetail"
                >
                  Proposals
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link className={`nav-link ${styles.navbar_cus_item}`} href="">
                  Projects
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link className={`nav-link ${styles.navbar_cus_item}`} href="">
                  Profile
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link className={`nav-link ${styles.navbar_cus_item}`} href="">
                  Transparency
                </Link>
              </li> */}
            </ul>
            {/* <form className={`${styles.navbar_search}`} role="search">
              <input
                className={`form-control ${styles.navbar_search_input}`}
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <i className="bi bi-search"></i>
            </form> */}
          </div>
        </nav>
        <div className={`container-fluid ${styles.proposalsContainer}`}>
          <div className="row">
            <div className="col-md-3">
              <div className={styles.filterCategory}>
                <h4 className={styles.categoryHead}>Filter by Category</h4>
                <ul className="list-group">
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("all")}
                  >
                    <span className={`${styles.icon_all}`}>
                      <RiCheckboxBlankFill />
                    </span>{" "}
                    All proposals
                  </li>
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("poi")}
                  >
                    <span className={`${styles.icon_poi}`}>
                      <MdLocationOn />
                    </span>{" "}
                    Point of Interest
                  </li>
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("build_model")}
                  >
                    <span className={`${styles.build_model} `}>
                      <MdBuild />
                    </span>{" "}
                    Model Build
                  </li>
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("ban_name")}
                  >
                    <span className={`${styles.ban_name} icon `}>
                      <MdBlock />
                    </span>{" "}
                    Name Ban
                  </li>
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("remove_hiring")}
                  >
                    <span className={`${styles.hiring} icon`}>
                      <MdWork />
                    </span>{" "}
                    Hiring
                  </li>
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("poll")}
                  >
                    <span className={`${styles.poll} icon`}>
                      <MdHowToVote />
                    </span>{" "}
                    Poll
                  </li>
                  {/* <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("grant_request")}
                  >
                    <span
                      className={`${styles.grant_request} icon grant_request`}
                    >
                      <MdAssignment />
                    </span>{" "}
                    Grant Request
                  </li>
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("governance")}
                  >
                    <span className={`${styles.governance} icon`}>
                      <MdHowToVote />
                    </span>{" "}
                    Governance Process
                  </li>
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("bidding")}
                  >
                    <span className={`${styles.icon} icon bidding`}>
                      <MdHowToVote />
                    </span>{" "}
                    Bidding and Tendering
                  </li> */}
                </ul>
              </div>

              {/* <div className={styles.filterStatus}>
                <h4 className={styles.categoryHead}>Filter by Status</h4>
                <ul className="list-group">
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("all-outcomes")}
                  >
                    All outcomes
                  </li>
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("active")}
                  >
                    Active
                  </li>
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("pending")}
                  >
                    Pending
                  </li>
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("completed")}
                  >
                    Completed
                  </li>
                </ul>
              </div>

              <div className={styles.filterTimeFrame}>
                <h4 className={styles.categoryHead}>Filter by TimeFrame</h4>
                <ul className="list-group">
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("all-time")}
                  >
                    All
                  </li>
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("last-week")}
                  >
                    Last Week
                  </li>
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("last-month")}
                  >
                    Last Month
                  </li>
                  <li
                    className={`list-group-item ${styles.listItem}`}
                    onClick={() => handleProposalClick("last-90-days")}
                  >
                    Last 90 Days
                  </li>
                </ul>
              </div> */}
            </div>
            <div className={`col-md-9 ${styles.rightPanel}`}>
              <div className="row">
                <div className="col-md-12 col-12 ">
                  <div className={` ${styles.header_box}`}>
                    <div className="dropdown">
                      <button
                        className={`dropdown-toggle ${styles.sortBtn}`}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Latest
                      </button>
                      <ul className="dropdown-menu dropdown-menu-dark">
                        <li>
                          <Link className="dropdown-item" href="">
                            Latest
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" href="">
                            Oldest
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <button className={styles.submitBtn} onClick={handleClick}>
                        Submit a Proposal
                      </button>
                    </div>
                    {/* <button className="btn btn-primary" onClick={handleClick}>
                    Submit a Proposal
                  </button> */}
                  </div>
                </div>
              </div>
              {/* <div className="container"> */}
              {loading ? (
                <div className="text-center">
                  <div className={styles.loader}></div> {/* Loader styles */}
                  <p>Loading...</p>
                </div>
              ) : (
                <>
                  <p className={styles.proposalCount}>
                    {proposals?.length} proposals
                  </p>
                  <div className="row">
                    {proposals?.length !== 0 ? (
                      proposals.map((proposal, index) => (
                        <div
                          key={index}
                          className={`card ${styles.proposalCard}`}
                          onClick={() => handleProposalDetail(proposal.Id)}
                        >
                          <div className="card-body py-1">
                            <div className="row align-items-center proposal_title">
                              <div className="col-1 text-center">
                                <img
                                  className={styles.proposal_image}
                                  src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${proposal.accountId || proposal.userName || "default"}`}
                                  alt={proposal.userName || "User"}
                                />
                              </div>
                              <div className="col-md-8 col-12">
                                {proposal.type === "ban_name" && (
                                  <>
                                    <h6>Ban the name {proposal.modelName}</h6>
                                    <p className="mb-1">
                                      By <span>{proposal.authorName || proposal.userName || proposal.author}</span> -{" "}
                                      {proposal.remainingDays <= 0
                                        ? `Ended ${Math.abs(
                                          proposal.remainingDays
                                        )} days ago`
                                        : `Ends in ${proposal.remainingDays} days`}
                                    </p>
                                  </>
                                )}
                                {proposal.type === "remove_banName" && (
                                  <>
                                    <h6>Remove ban on the name {proposal.modelName}</h6>
                                    <p className="mb-1">
                                      By <span>{proposal.authorName || proposal.userName || proposal.author}</span> -{" "}
                                      {proposal.remainingDays <= 0
                                        ? "Voting ended"
                                        : `Ends in ${proposal.remainingDays} days`}
                                    </p>
                                  </>
                                )}
                                {proposal.type === "remove_name" && (
                                  <>
                                    <h6>Remove the name {proposal.name}</h6>
                                    <p className="mb-1">
                                      By <span>{proposal.authorName || proposal.userName || proposal.author}</span> -{" "}
                                      {proposal.remainingDays <= 0
                                        ? `Ended ${Math.abs(
                                          proposal.remainingDays
                                        )} days ago`
                                        : `Ends in ${proposal.remainingDays} days`}
                                    </p>
                                  </>
                                )}
                                {proposal.type === "poi" && (
                                  <>
                                    <h6>
                                      Add the location {proposal.modelName} to the
                                      Points of Interest
                                    </h6>
                                    <p className="mb-1">
                                      By <span>{proposal.authorName || proposal.userName || proposal.author}</span> -{" "}
                                      {proposal.remainingDays <= 0
                                        ? `Ended ${Math.abs(
                                          proposal.remainingDays
                                        )} days ago`
                                        : `Ends in ${proposal.remainingDays} days`}
                                    </p>
                                  </>
                                )}
                                {proposal.type === "remove_poi" && (
                                  <>
                                    <h6>
                                      Remove the location{" "}
                                      {proposal.modelName || `${proposal.x}, ${proposal.y}`}{" "}
                                      from the Points of Interest
                                    </h6>
                                    <p className="mb-1">
                                      By <span>{proposal.authorName || proposal.userName || proposal.author}</span> -{" "}
                                      {proposal.remainingDays <= 0
                                        ? `Ended ${Math.abs(
                                          proposal.remainingDays
                                        )} days ago`
                                        : `Ends in ${proposal.remainingDays} days`}
                                    </p>
                                  </>
                                )}
                                {proposal.type === "hiring" && (
                                  <>
                                    <h6>
                                      Add {proposal.userName} to dao committee
                                    </h6>
                                    <p className="mb-1">
                                      By <span>{proposal.authorName || proposal.userName || proposal.author}</span> -{" "}
                                      {proposal.remainingDays <= 0
                                        ? `Ended ${Math.abs(
                                          proposal.remainingDays
                                        )} days ago`
                                        : `Ends in ${proposal.remainingDays} days`}
                                    </p>
                                  </>
                                )}
                                {proposal.type === "remove_hiring" && (
                                  <>
                                    <h6>
                                      Remove {proposal.userName} from dao
                                      committee
                                    </h6>
                                    <p className="mb-1">
                                      By <span>{proposal.authorName || proposal.userName || proposal.author}</span> -{" "}
                                      {proposal.remainingDays <= 0
                                        ? `Ended ${Math.abs(
                                          proposal.remainingDays
                                        )} days ago`
                                        : `Ends in ${proposal.remainingDays} days`}
                                    </p>
                                  </>
                                )}
                                {proposal.type === "build_model" && (
                                  <>
                                    <h6>Build model {proposal.modelName}</h6>
                                    <p className="mb-1">
                                      By <span>{proposal.authorName || proposal.userName || proposal.author}</span> -{" "}
                                      {proposal.remainingDays <= 0
                                        ? `Ended ${Math.abs(
                                          proposal.remainingDays
                                        )} days ago`
                                        : `Ends in ${proposal.remainingDays} days`}
                                    </p>
                                  </>
                                )}
                                {proposal.type === "remove_model" && (
                                  <>
                                    <h6>Remove model {proposal.modelName}</h6>
                                    <p className="mb-1">
                                      By <span>{proposal.authorName || proposal.userName || proposal.author}</span> -{" "}
                                      {proposal.remainingDays <= 0
                                        ? `Ended ${Math.abs(
                                          proposal.remainingDays
                                        )} days ago`
                                        : `Ends in ${proposal.remainingDays} days`}
                                    </p>
                                  </>
                                )}
                                {proposal.type === "poll" && (
                                  <>
                                    <h6>{proposal.question || proposal.modelName}</h6>
                                    <p className="mb-1">
                                      By <span>{proposal.authorName || proposal.userName || proposal.author}</span> -{" "}
                                      {proposal.remainingDays <= 0
                                        ? `Ended ${Math.abs(
                                          proposal.remainingDays
                                        )} days ago`
                                        : `Ends in ${proposal.remainingDays} days`}
                                    </p>
                                  </>
                                )}
                              </div>
                              <div className="col-md-3 col-12 text-end">
                                <div className={styles.box_btn}>
                                  <button
                                    type="button"
                                    className={`${styles.cus_btn} ${proposal.status === "Passed"
                                        ? styles.passed
                                        : proposal.status === "Active"
                                          ? styles.active
                                          : proposal.status === "Enacted"
                                            ? styles.enacted
                                            : proposal.status === "Rejected"
                                              ? styles.rejected
                                              : proposal.status === "Expired"
                                                ? styles.expired
                                                : ""
                                      }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleProposalAction(
                                        typeof proposal.status === "string"
                                          ? proposal.status.toLowerCase()
                                          : "unknown",
                                        index
                                      );
                                    }}
                                  >
                                    {typeof proposal.status === "string"
                                      ? proposal.status
                                      : "Empty"}
                                  </button>

                                  <button
                                    type="button"
                                    className={`${styles.cus_btn_2} ${
                                      proposal.type === "poll"              ? styles.type_poll
                                      : proposal.type === "ban_name"        ? styles.type_ban_name
                                      : proposal.type === "remove_banName"  ? styles.type_remove_ban_name
                                      : proposal.type === "poi"             ? styles.type_poi
                                      : proposal.type === "build_model"     ? styles.type_build_model
                                      : proposal.type === "hiring" || proposal.type === "remove_hiring" ? styles.type_hiring
                                      : styles.type_default
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleProposalAction(proposal.type, index);
                                    }}
                                  >
                                    {proposal.type === "remove_banName" ? "Remove Ban" : proposal.type?.replace(/_/g, " ")}
                                  </button>

                                  {(proposal.type === "ban_name" ||
                                    proposal.type === "poi" ||
                                    proposal.type === "build_model") && (
                                      <div>
                                        <Link
                                          href={`/dao/proposal/proposalDetail/${index}`}
                                        >
                                          <button
                                            type="button"
                                            className={`btn shadow-none border-0 ${styles.arrowlink}`}
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <i className="bi bi-caret-right"></i>
                                          </button>
                                        </Link>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={`${styles.message_container}`}>
                        <div className={`${styles.message_text}`}>
                          The proposal has not been created yet
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className={styles.paginationWrapper}>
                <button
                  className={`${styles.pageBtn} ${currentPage === 1 ? styles.pageBtnDisabled : ""}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>

                {start > 1 && (
                  <>
                    <button className={styles.pageBtn} onClick={() => handlePageChange(1)}>1</button>
                    {start > 2 && <span className={styles.pageDots}>…</span>}
                  </>
                )}

                {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
                  <button
                    key={page}
                    className={`${styles.pageBtn} ${page === currentPage ? styles.pageBtnActive : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                {end < totalPages && (
                  <>
                    {end < totalPages - 1 && <span className={styles.pageDots}>…</span>}
                    <button className={styles.pageBtn} onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                  </>
                )}

                <button
                  className={`${styles.pageBtn} ${currentPage === totalPages ? styles.pageBtnDisabled : ""}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer autoClose={1000} />
      </div>
    </>
  );
};

export default Proposal;
