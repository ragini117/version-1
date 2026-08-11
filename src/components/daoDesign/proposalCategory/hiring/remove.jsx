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

const Remove = () => {
  const { loginReducer } = useSelector((state) => state);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    targetCommittee: "Dao Committee",
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
  const handleEvidenceChange = (value) => {
    setFormData({
      ...formData,
      evidence: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const token = localStorage.getItem("_auth_token");
      const account = localStorage.getItem("address");
      const receipt = await connectWallet();

      if (receipt.address !== account.toLowerCase()) {
        throw new Error("Connected account does not match the stored account.");
      }

      const response = await axios.post(
        "/DAO/removehiring",
        {
          adminAddress: formData.committeeAddress,
          reason: formData.reason,
          target: formData.targetCommittee,
          evidence: formData.evidence,
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
          evidence: "",
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
        title: `Proposal to Remove a Member of Committee`,
        description: `Should Remove a Member of Committee ${formData.targetCommittee}`,
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

  // const hub = "https://hub.snapshot.org";
  // const initializeSnapshotClient = async (web3, account) => {
  //   try {
  //     const client = new snapshot.Client712(hub);
  //     console.log("Client initialized:", client);

  //     const currentTimestamp = Math.floor(Date.now() / 1000);
  //     const latestBlockNumber = await web3.getBlockNumber();
  //     const snapshotBlockNumber = latestBlockNumber - 100;
  //     console.log("Latest Block Number:", latestBlockNumber);
  //     console.log("Snapshot Block Number:", snapshotBlockNumber);

  //     const receipt = await client.proposal(web3, account, {
  //       space: "decentrawood.eth",
  //       type: "single-choice",
  //       title: `Remove ${profileName}`,
  //       body: formData.reason,
  //       choices: ["Yes", "No", "Abstain"],
  //       start: currentTimestamp,
  //       end: currentTimestamp + 7 * 24 * 60 * 60,
  //       snapshot: snapshotBlockNumber,
  //       plugins: JSON.stringify({}),
  //       app: "Decentrawood DAO",
  //     });

  //     console.log("Receipt:", receipt);
  //     localStorage.setItem("snapshotReceipt", JSON.stringify(receipt));

  //     return receipt;
  //   } catch (error) {
  //     console.error("Error creating proposal:", error.message);
  //     throw error;
  //   }
  // };

  // const getVotingPower = async (address) => {
  //   try {
  //     const web3 = new Web3Provider(window.ethereum);
  //     const latestBlockNumber = await web3.getBlockNumber();
  //     const network = "137";
  //     const strategies = [
  //       {
  //         name: "erc20-balance-of",
  //         params: {
  //           address: "0xE77aBB1E75D2913B2076DD16049992FFeACa5235",
  //           symbol: "DEOD",
  //           decimals: 18,
  //         },
  //       },
  //       {
  //         name: "erc721-multi-registry-weighted",
  //         params: {
  //           symbol: "LAND",
  //           tokens: [
  //             "0x93654CDDE2988abD0057345e823f3902828C71A6",
  //             "0x61E32A2e181D638826Fe27dE6f4B05fD7dDafbc1",
  //             "0x5C64b96B99E67242D21931e1e1c109CE8D37822b",
  //             "0x5e5df09aeDFBaf04B8A58320114bf8238F722e69",
  //             "0x0202b1Ad74664ddAbADd5C203318C3b296816476",
  //             "0x3abE74bEb3067c77A57C8DdDedEe3B9Dd111F9fd",
  //             "0xe19121BD83c917c61186D2B1f9D6094D9C5FED56",
  //             "0x6e39f4E0De487a3BF77029f653dA7240FaA1eD2d"
  //           ],
  //           weights: [2000, 4000, 10000, 25000, 2000, 4000, 10000, 25000],
  //         },
  //       },
  //     ];

  //     const snapshots = latestBlockNumber;
  //     const space = "decentrawood.eth";
  //     const delegation = true;
  //     const votingPower = await snapshot.utils.getVp(
  //       address,
  //       network,
  //       strategies,
  //       snapshots,
  //       space,
  //       delegation
  //     );
  //     return votingPower;
  //   } catch (error) {
  //     console.error("Error getting VP :", error.message);
  //     throw error;
  //   }
  // };

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
      <h1 className={styles.header}>Remove Committee Member</h1>
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
            placeholder="Enter committee member address to remove "
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Reason for Removal (optional)</label>
          <ReactQuill
            className={styles.quill}
            value={formData.reason}
            onChange={handleDescriptionChange}
            placeholder="Describe why you want to remove this member."
          />
        </div>
        <div className={`my-2 ${styles.formGroup}`}>
          <label className={styles.label}>
            Evidence for Removal (optional)
          </label>
          <ReactQuill
            className={styles.quill}
            value={formData.evidence}
            onChange={handleEvidenceChange}
            placeholder="Describe evidence for remove this member."
          />
        </div>

        <button
          type="submit"
          className={`btn btn-primary ${styles.button}`}
          disabled={submitting}
        >
          {submitting ? "Processing..." : "Submit Removal"}
        </button>
      </form>
      <ToastContainer />
      </div>
    </div>
  );
};

export default Remove;
