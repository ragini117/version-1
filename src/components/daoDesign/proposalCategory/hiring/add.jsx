import React, { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";
import { Web3Provider } from "@ethersproject/providers";
import { useRouter } from "next/navigation";

import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import styles from "./hiring.module.css";
import { useSelector } from "react-redux";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const add = () => {
  const { loginReducer } = useSelector((res) => res);
  const accountId = loginReducer?.userDetail?.accountId;
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    targetCommittee: "DAO Committee",
    committeeAddress: "",
    reason: "",
  });
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("_auth_token");
    const account = localStorage.getItem("address");
    if (!token || !account) {
      setError("Please connect your wallet and make sure you are logged in.");
    }
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "committeeAddress" && value) {
      try {
        const token = localStorage.getItem("_auth_token");
        const response = await axios.get(`/DAO/checkUser/${value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          setUserDetails(response.data.data);
        } else {
          setUserDetails(null);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Error fetching user details. Please try again later.");
      }
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData({
      ...formData,
      reason: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    debugger;
    try {
      if (!accountId && !localStorage.getItem("address")) {
        toast.error("Please connect your wallet in your profile before submitting a proposal.");
        return;
      }
      const token = localStorage.getItem("_auth_token");
      const account = localStorage.getItem("address");
      const receipt = await connectWallet();

      if (receipt.address !== account.toLowerCase()) {
        throw new Error("Connected account does not match the stored account.");
      }

      const response = await axios.post(
        "/DAO/hiring",
        {
          target: formData.targetCommittee,
          adminAddress: userDetails?.adminAddress,
          reason: formData.reason,
          receipt: receipt.receipt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        toast.success("Member removal processed successfully!");
        setFormData({
          targetCommittee: "",
          committeeAddress: "",
          reason: "",
        });
        router.push("/dao/proposal");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast.error("Error submitting proposal: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not detected");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3Provider(window.ethereum);
      const latestBlockNumber = await web3.getBlockNumber();
      const accounts = await web3.listAccounts();
      const account = accounts[0].toLowerCase();
      localStorage.setItem("connectedAccount", account);
      const message = {
        proposer: account,
        title: `Proposal to Add Committee Member`,
        description: `Should we add ${formData.committeeAddress} to ${formData.targetCommittee}`,
        timestamp: Date.now(),
        blockNumber: latestBlockNumber,
      };
      const signer = web3.getSigner();
      const signature = await signer.signMessage(JSON.stringify(message, null, 1));
      return { address: account, receipt: signature, blockNumber: latestBlockNumber };
    } catch (error) {
      console.error("Error connecting wallet:", error.message);
      throw error;
    }
  };
  useEffect(() => {
    if (loginReducer?.isLogin) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${loginReducer?.userDetail?.token}`;
    }
  }, [loginReducer]);
  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
      <h1 className={styles.header}>Add Committee Member</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Target Committee</label>
          <select
            className={`form-control shadow-none ${styles.input}`}
            name="targetCommittee"
            value={formData.targetCommittee}
            onChange={handleChange}
            required
          >
            <option value="DAO Committee">DAO Committee</option>
            <option value="SAB Committee">SAB Committee</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Committee Member Address</label>
          <input
            className={`form-control shadow-none ${styles.input}`}
            type="text"
            name="committeeAddress"
            value={formData.committeeAddress}
            onChange={handleChange}
            placeholder="Enter Committee Member Address"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Reason for Adding (optional)</label>
          <ReactQuill
            className={styles.quill}
            value={formData.reason}
            onChange={handleDescriptionChange}
            placeholder="Describe why you want to add this."
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Proposal"}
        </button>
      </form>
      <ToastContainer />
      </div>
    </div>
  );
};

export default add;
