import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./nameBan.module.css";
import { Apiurl3 } from "../../../../../environment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { Web3Provider } from "@ethersproject/providers";
import { useSelector } from "react-redux";


const Remove = () => {
  const { loginReducer } = useSelector((res) => res);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [reason, setReason] = useState(""); // Added reason state
  const [submitting, setSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!name.trim()) { setSuggestions([]); return; }
    const timeout = setTimeout(() => {
      axios.get(`/DAO/getUserData?search=${encodeURIComponent(name)}`)
        .then((res) => {
          const data = res.data?.data || res.data || [];
          setSuggestions(Array.isArray(data) ? data : [data]);
        })
        .catch(() => setSuggestions([]));
    }, 300);
    return () => clearTimeout(timeout);
  }, [name]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const receipt = await connectWallet();
      const response = await axios.post("/DAO/removeBanName", {
        modelName: name,
        description: description,
        receipt: receipt.receipt,
        blockNumber: receipt.blockNumber,
      }, {
        headers: { Authorization: `Bearer ${loginReducer?.userDetail?.token}` },
      });

      if (response.data.status) {
        toast.success("Ban remove name proposal submitted successfully.");
        router.push("/dao/proposal");
        setName("");
        setDescription("");
        setWalletAddress("");
      } else {
        toast.error(
          "Failed to submit ban name proposal: " + response.data.message
        );
      }
    } catch (error) {
      console.error("Error submitting ban name proposal:", error);
      toast.error("Failed to submit ban name proposal: " + (error.response?.data?.message || error.message));
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
            title: `Proposal to Remove the Ban on Name`,
            description: `Should we remove the Ban on Name ${name}`,
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
  // const initializeSnapshotClient = async (web3, account, reason) => {
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
  //       title: `Remove the ban name ${name}`,
  //       body: reason, // Use reason here
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

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.header}>Remove a Ban</h1>
        <p className={styles.subheader}>
          Propose removing the ban on a previously banned name from Decentrawood.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Banned name to unban</label>
            <div style={{ position: "relative" }}>
              <input
                className={styles.input}
                type="text"
                placeholder="Enter the currently banned name"
                value={name}
                onChange={(e) => { setName(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                autoComplete="off"
                required
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className={styles.suggestions}>
                  {suggestions.map((item, i) => {
                    const isUser = item.type === "user";
                    const displayName = isUser ? item.userName : item.modelName;
                    if (!displayName) return null;
                    return (
                      <li
                        key={i}
                        className={styles.suggestionItem}
                        onMouseDown={() => { setName(displayName); setShowSuggestions(false); }}
                      >
                        <div className={styles.suggestionRow}>
                          <span className={isUser ? styles.badgeUser : styles.badgeModel}>
                            {isUser ? "User" : "Model"}
                          </span>
                          <span className={styles.suggestionName}>{displayName}</span>
                        </div>
                        {isUser && item.accountId && (
                          <div className={styles.suggestionWallet}>{item.accountId}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Description</label>
            <p className={styles.hint}>
              Explain why this name should be unbanned. For example: why was the ban unjustified or no longer relevant?
            </p>
            <textarea
              className={styles.textarea}
              placeholder="Describe why this name ban should be removed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Co-authors{" "}
              <span style={{ fontWeight: 400, textTransform: "none", color: "#64748b" }}>
                (optional)
              </span>
            </label>
            <p className={styles.hint}>
              Add co-author wallet addresses. They will be asked to confirm before being listed publicly.
            </p>
            <input
              className={styles.input}
              type="text"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>

          <div className={styles.buttonBox}>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Proposal"}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Remove;
