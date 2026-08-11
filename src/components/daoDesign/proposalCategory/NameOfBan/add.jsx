import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../DaoForm.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { Web3Provider } from "@ethersproject/providers";
import snapshot from "@snapshot-labs/snapshot.js";
import { useSelector } from "react-redux";


const Add = () => {
    const [name, setName] = useState("");
    const { loginReducer } = useSelector((res) => res);
    const accountId = loginReducer?.userDetail?.accountId;
    const [description, setDescription] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [reason, setReason] = useState("");
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
        debugger;
        event.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        console.log("Submitting form...");

        try {
            if (!accountId && !localStorage.getItem("address")) {
                toast.error("Please connect your wallet in your profile before submitting a proposal.");
                return;
            }
            const token = localStorage.getItem("_auth_token");
            const account = localStorage.getItem("address");

            const receipt = await connectWallet();
            if (receipt.address !== account.toLowerCase()) {
                throw new Error(
                    "Connected account does not match the stored account.",
                );
            }

            const response = await axios.post("/DAO/ban-name", {
                modelName: name,
                description: description,
                receipt: receipt.receipt,
                blockNumber: receipt.blockNumber,
            });

            if (response.data.status) {
                toast.success("Ban name proposal submitted successfully.");
                router.push("/dao/proposal");
                setName("");
                setDescription("");
                setWalletAddress("");
            } else {
                console.log("Toast error"); // Debug statement
                toast.error(
                    "Failed to submit ban name proposal: " +
                        response.data.message,
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
            console.log("Latest block number:", latestBlockNumber);
            const accounts = await web3.listAccounts();
            const account = accounts[0].toLowerCase();
            console.log("Connected account:", account);
            localStorage.setItem("connectedAccount", account);
            const message = {
                proposer: account,
                title: `Proposal for Ban Name`,
                description: `Should we Ban the Name ${name}`,
                timestamp: Date.now(),
                blockNumber: latestBlockNumber,
            };
            const signer = await web3.getSigner();
            const Message = JSON.stringify(message, null, 1);
            const signature = await signer.signMessage(Message);
            return {
                address: account,
                receipt: signature,
                blockNumber: latestBlockNumber,
            };
        } catch (error) {
            console.error("Error connecting wallet:", error.message);
            throw error;
        }
    };
    // const connectWallet = async () => {
    //   try {
    //     const web3 = new Web3Provider(window.ethereum);

    //     if (!web3) {
    //       throw new Error("MetaMask not detected");
    //     }
    //     await window.ethereum.request({ method: "eth_requestAccounts" });
    //     const accounts = await web3.listAccounts();
    //     const account = accounts[0].toLowerCase();
    //     console.log("Connected account:", account);
    //     const localaccount = localStorage.getItem("address");
    //     localStorage.setItem("connectedAccount", account);
    //     if (localaccount == account) {
    //       const votingPowerData = await getVotingPower(account);
    //       const votingPower = votingPowerData.vp;
    //       console.log("votingPower", votingPower);
    //       if (votingPower < 300) {
    //         toast.warning("You need atleast 2000 voting power.");
    //       } else {
    //         const receipt = await initializeSnapshotClient(web3, account);
    //         return { address: account, receipt: receipt };
    //       }
    //     }
    //   } catch (error) {
    //     console.error("Error connecting wallet:", error.message);
    //     throw error;
    //   }
    // };
    const hub = "https://testnet.snapshot.org";
    // const hub = "https://hub.snapshot.org";

    const initializeSnapshotClient = async (web3, account, reason) => {
        debugger;
        try {
            const client = new snapshot.Client712(hub);
            console.log("Client initialized:", client);

            const currentTimestamp = Math.floor(Date.now() / 1000);
            const latestBlockNumber = await web3.getBlockNumber();
            const snapshotBlockNumber = latestBlockNumber - 100;
            console.log("Latest Block Number:", latestBlockNumber);
            console.log("Snapshot Block Number:", snapshotBlockNumber);

            const receipt = await client.proposal(web3, account, {
                space: "metadata.eth",
                type: "single-choice",
                title: `Add the ban name ${name}`,
                body: description,
                choices: ["Yes", "No", "Abstain"],
                start: currentTimestamp,
                end: currentTimestamp + 7 * 24 * 60 * 60,
                snapshot: snapshotBlockNumber,
                plugins: JSON.stringify({}),
                app: "Testing DAO",
            });
            console.log("Receipt:", receipt);
            localStorage.setItem("snapshotReceipt", JSON.stringify(receipt));
            return receipt;
        } catch (error) {
            console.error("Error creating proposal:", error.message);
            throw error;
        }
    };
    // const initializeSnapshotClient = async (web3, account, reason) => {
    //   debugger;
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
    //       title: `Add the ban name ${name}`,
    //       body: description,
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
            axios.defaults.headers.common["Authorization"] =
                `Bearer ${loginReducer?.userDetail?.token}`;
        }
    }, [loginReducer]);
    return (
        <div className={styles.container}>
          <div className={styles.formCard}>
            <h1 className={styles.header}>Ban a name</h1>
            <p className={styles.paragraph}>
                Banning a name prevents the use of abusive or offensive names
                for avatars and scenes.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label}>The name you want to ban</label>
                <div style={{ position: "relative" }}>
                    <input
                        className={`form-control shadow-none ${styles.input}`}
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setShowSuggestions(true); }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        autoComplete="off"
                        required
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ul style={{
                            position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
                            background: "#12062d", border: "1px solid #7c3aed", borderRadius: "6px",
                            maxHeight: "220px", overflowY: "auto", listStyle: "none",
                            margin: 0, padding: 0,
                        }}>
                            {suggestions.map((item, i) => {
                                const isUser = item.type === "user";
                                const displayName = isUser ? item.userName : item.modelName;
                                if (!displayName) return null;
                                return (
                                    <li
                                        key={i}
                                        onMouseDown={() => { setName(displayName); setShowSuggestions(false); }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(124,58,237,0.2)"}
                                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                        style={{
                                            padding: "8px 12px", cursor: "pointer",
                                            borderBottom: "1px solid rgba(124,58,237,0.2)",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span style={{
                                                fontSize: "10px", fontWeight: 600, padding: "2px 6px",
                                                borderRadius: "4px", textTransform: "uppercase",
                                                background: isUser ? "rgba(52,211,153,0.15)" : "rgba(96,165,250,0.15)",
                                                color: isUser ? "#34d399" : "#60a5fa",
                                                flexShrink: 0,
                                            }}>
                                                {isUser ? "User" : "Model"}
                                            </span>
                                            <span style={{ color: "#e2e8f0", fontWeight: 500 }}>{displayName}</span>
                                        </div>
                                        {isUser && item.accountId && (
                                            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px", paddingLeft: "2px" }}>
                                                {item.accountId}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <label className={styles.label}>Description</label>
                <p className={styles.paragraph}>
                    Provide a brief explanation of why this name should be
                    banned. For example: why or to whom might it be offensive?
                </p>
                <textarea
                    className={`form-control shadow-none ${styles.textarea}`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <label className={styles.coAuthors}>
                    Co-authors (optional)
                </label>
                <p className={styles.paragraph}>
                    If you co-authored this proposal with someone else, you can
                    add their wallet addresses to acknowledge their work. After
                    you publish the proposal, co-authors will be asked to
                    confirm or reject the request. Only if they confirm, they
                    will be listed publicly on the proposal page.
                </p>
                <input
                    className={`form-control shadow-none ${styles.input}`}
                    type="text"
                    placeholder="Enter a wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                />

                <div className={`${styles.button_box}`}>
                    <button type="submit" className={styles.submitButton}>
                        Submit Proposal
                    </button>
                </div>
            </form>
            <ToastContainer />
          </div>
        </div>
    );
};

export default Add;
