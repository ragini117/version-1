import React, { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";
import { Web3Provider } from "@ethersproject/providers";
import snapshot from "@snapshot-labs/snapshot.js";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import styles from "./poi.module.css";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const PointOfInterestRemove = () => {
  const { loginReducer } = useSelector((res) => res);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [models, setModels] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    // xCoordinate: "",
    // yCoordinate: "",
    locationName: "",
    description: "",
    coAuthors: "",
  });
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("_auth_token");
    const account = localStorage.getItem("address");
    if (!token || !account) {
      setError("Please connect your wallet and make sure you are logged in.");
    }
  }, []);

  useEffect(() => {
    axios.get("/DAO/getAllModels")
      .then((res) => {
        const data = res.data?.data || res.data || [];
        const names = data.map((m) => m.modelName || m.name || m).filter(Boolean);
        setModels(names);
      })
      .catch(() => {});
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDescriptionChange = (value) => {
    setFormData({
      ...formData,
      description: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    debugger;
    try {
      const token = localStorage.getItem("_auth_token");
      const account = localStorage.getItem("address");
      const receipt = await connectWallet();
      console.log("receiptAbdul",receipt);
      
      if (receipt.address !== account.toLowerCase()) {
        throw new Error("Connected account does not match the stored account.");
      }

      const response = await axios.post(
        "/DAO/removepoi",
   
        {
          modelName: formData.locationName,
          description: formData.description,
          coAuthors: formData.coAuthors,
          receipt: receipt.receipt,
        },
      {  headers: {
          'Authorization': `Bearer ${loginReducer?.userDetail?.token}`
        }},
      
      );

      if (response.data.status) {
        toast.success("Point of interest removed successfully!");
        setFormData({
          locationName: "",
          description: "",
          coAuthors: "",
          receipt: {},
        });
        router.push("/dao/proposal");
      } else {
        setError(response.data.message || "Failed to remove point of interest");
      }
    } catch (error) {
      console.error("Error removing point of interest:", error);
      toast.error("Error removing point of interest: " + (error.response?.data?.message || error.message));
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

      const storedAccount = loginReducer?.userDetail?.accountId || localStorage.getItem("address");
      if (account !== storedAccount?.toLowerCase()) {
        throw new Error("Connected account does not match the stored account.");
      }

      const message = {
        proposer: account,
        title: `Proposal to Remove Point of Interest`,
        description: `Should we Remove a Point of Interest ${formData.locationName}`,
        timestamp: Date.now(),
        blockNumber: latestBlockNumber,
      };
      const signer = web3.getSigner();
      const signature = await signer.signMessage(JSON.stringify(message, null, 1));

      return { address: account, receipt: signature };
    } catch (error) {
      console.error("Error connecting wallet:", error.message);
      throw error;
    }
  };

  // const hub = "https://hub.snapshot.org";
  // const initializeSnapshotClient = async (web3, account) => {
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
  //       title: `Remove the location ${formData.locationName} from the Points of Interest`,
  //       body: formData.description,
  //       choices: ["Yes", "No", "Abstain"],
  //       start: currentTimestamp,
  //       end: currentTimestamp + 7 * 24 * 60 * 60,
  //       snapshot: snapshotBlockNumber,
  //       plugins: JSON.stringify({}),
  //       app: "Decentrawood DAO",
  //     });
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
      <h1 className={styles.header}>Remove Point of Interest</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup} style={{ position: "relative" }}>
          <label className={styles.label}>Location Name</label>
          <input
            className={`form-control shadow-none ${styles.input}`}
            type="text"
            name="locationName"
            value={formData.locationName}
            onChange={(e) => {
              handleChange(e);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="Enter location name you want to remove"
            autoComplete="off"
            required
          />
          {showSuggestions && models.filter((m) =>
            m.toLowerCase().includes(formData.locationName.toLowerCase()) && formData.locationName
          ).length > 0 && (
            <ul className={styles.suggestions}>
              {models
                .filter((m) => m.toLowerCase().includes(formData.locationName.toLowerCase()))
                .map((m, i) => (
                  <li
                    key={i}
                    className={styles.suggestionItem}
                    onMouseDown={() => {
                      setFormData((prev) => ({ ...prev, locationName: m }));
                      setShowSuggestions(false);
                    }}
                  >
                    {m}
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Description (optional)</label>
          <ReactQuill
            className={styles.quill}
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Describe why this location is noteworthy"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Co-authors (optional)</label>
          <input
            className={`form-control shadow-none ${styles.input}`}
            type="text"
            name="coAuthors"
            value={formData.coAuthors}
            onChange={handleChange}
            placeholder="Enter co-authors' wallet addresses"
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

export default PointOfInterestRemove;
