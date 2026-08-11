import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./modelBuild.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Web3Provider } from "@ethersproject/providers";
import snapshot from "@snapshot-labs/snapshot.js";
import { Apiurl2 } from "../../../../../environment"; // Ensure correct import of environment variable
import { useRouter } from "next/navigation";
import { axiosInstance2 } from "@/redux/provider";
import { useSelector } from "react-redux";
import { getVotingPower } from "../../votingPower";

const Add = () => {
  const { loginReducer } = useSelector((res) => res);
  const accountId = loginReducer?.userDetail?.accountId;
  const [name, setName] = useState("");
  const [xCoord, setXCoord] = useState("");
  const [yCoord, setYCoord] = useState("");
  const [zCoord, setZCoord] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
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

      // Use receipt.id and receipt.ipfs in the payload
      const payload = {
        modelName: name,
        x: xCoord,
        y: yCoord,
        z: zCoord,
        description: reason,
        receipt: receipt.receipt
      };

      console.log("Payload:", payload);

      const response = await axios.post("/DAO/build-model", payload);

      if (response.data.status) {
        toast.success("Model proposal created successfully!");
        router.push("/dao/proposal");
        setName("");
        setReason("");
      } else {
        toast.error(
          `Failed to create model proposal: ${response.data.message}`
        );
      }
    } catch (error) {
      console.error("Error creating model proposal:", error);
      toast.error("Failed to create model proposal: " + (error.response?.data?.message || error.message));
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
        console.log("Connected account:", account);
        const localaccount = localStorage.getItem("address");
        localStorage.setItem("connectedAccount", account);
        if (localaccount == account) {
          const votingPowerData = await getVotingPower(account, latestBlockNumber);
            const message = {
        proposer: account,
        title: `Proposal to Build a Model ${name}`,
        description: `Should we Build a Model at ${xCoord} ${yCoord} ${zCoord}`,
        timestamp: Date.now(),
        blockNumber: latestBlockNumber
      };
       const signer = await web3.getSigner() 
       const Message = JSON.stringify(message, null, 1);
       const signature = await signer.signMessage(Message);
          // const votingPowerData = await getVotingPower("0xBB997cb670bc9c6c81C0668A5F4Fa6042e3DBCf6" ,latestBlockNumber);
          console.log("votingPowerData", votingPowerData)
          const votingPower = votingPowerData
          // const votingPower = votingPowerData.vp;
          console.log("votingPower", votingPower);
          if (votingPower < 100000) {
            toast.warning("You need atleast 100000 voting power.");
          } else {
            // const receipt = await initializeSnapshotClient(web3, account);
            return { address: account, receipt: signature };
          }
        }
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
  //       title: `Add ${name} to the Model build`,
  //       body: reason,
  //       choices: ["Yes", "No", "Abstain"],
  //       start: currentTimestamp,
  //       end: currentTimestamp + 7 * 24 * 60 * 60,
  //       snapshot: snapshotBlockNumber,
  //       plugins: JSON.stringify({}),
  //       app: "Decentrawood DAO",
  //     });

  //     // Assuming receipt contains `id` and `ipfs` fields
  //     const { id, ipfs } = receipt; // Adjust if the receipt object structure is different
  //     localStorage.setItem("snapshotReceipt", JSON.stringify(receipt));

  //     return {
  //       id,
  //       ipfs,
  //     };
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
      <h1 className={styles.header}>Add Model Build Node</h1>
      <p className={styles.paragraph}>
        To propose the addition of a new Model Build node, please provide the
        following details.
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>Model Name</label>
        <input
          className={`mx-1 form-control shadow-none ${styles.input}`}
          placeholder="Enter name of model"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className={styles.coordinateBox}>
          <div className={styles.coordinateInput}>
            <label className={styles.label}>X Coordinates</label>
            <input
              className={`mx-1 form-control shadow-none ${styles.input}`}
              placeholder="X Coordinates"
              type="text"
              value={xCoord}
              onChange={(e) => setXCoord(e.target.value)}
              required
            />
          </div>
          <div className={styles.coordinateInput}>
            <label className={styles.label}>Y Coordinates</label>
            <input
              className={`form-control shadow-none ${styles.input}`}
              placeholder="Y Coordinates"
              type="text"
              value={yCoord}
              onChange={(e) => setYCoord(e.target.value)}
              required
            />
          </div>
          <div className={styles.coordinateInput}>
            <label className={styles.label}>Z Coordinates</label>
            <input
              className={`form-control shadow-none ${styles.input}`}
              placeholder="Z Coordinates"
              type="text"
              value={zCoord}
              onChange={(e) => setZCoord(e.target.value)}
              required
            />
          </div>
        </div>

        <label className={styles.label}>Reason for Adding (optional)</label>
        <textarea
          className={`form-control shadow-none ${styles.textarea}`}
          placeholder="Explain why this Model Build node should be added. Provide any relevant details or reasons for the addition."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className={styles.buttonBox}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Proposal"}
          </button>
        </div>
      </form>
      <ToastContainer />
      </div>
    </div>
  );
};

export default Add;
