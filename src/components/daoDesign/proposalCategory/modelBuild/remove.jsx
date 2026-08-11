import React, { useState } from "react";
import styles from "./modelBuild.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Web3Provider } from "@ethersproject/providers";
import snapshot from "@snapshot-labs/snapshot.js";
import { useRouter } from "next/navigation";
import { axiosInstance2 } from "@/redux/provider";
import { getVotingPower } from "../../votingPower";

const Remove = () => {
  const [name, setName] = useState("");
  const [xCoord, setXCoord] = useState("");
  const [yCoord, setYCoord] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const receipt = await connectWallet();
      const payload = {
        x: xCoord,
        y: yCoord,
        modelName: name,
        reason: reason,
        receipt: receipt,
      };
      const response = await axiosInstance2.post("/DAO/removemodel", payload);

      if (response.data.status) {
        toast.success("Model removal proposal created successfully!");
        router.push("/dao/proposal"); // Redirect to proposal page after success
        setName("");
        setXCoord("");
        setYCoord("");
        setReason("");
      } else {
        toast.error(
          "Failed to create model removal proposal. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating model removal proposal:", error);
      toast.error("Failed to create model removal proposal: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

const connectWallet = async () => {
      try {
        const web3 = new Web3Provider(window.ethereum);
        if (!web3) {
          throw new Error("MetaMask not detected");
        }
        const latestBlockNumber = await web3.getBlockNumber();
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.listAccounts();
        const account = accounts[0].toLowerCase();
        console.log("Connected account:", account);
        const localaccount = localStorage.getItem("address");
        localStorage.setItem("connectedAccount", account);
        if (localaccount == account) {
          const votingPowerData = await getVotingPower(account, latestBlockNumber);
            const message = {
        proposer: account,
        title: `Proposal to Remove a Model ${name}`,
        description: `Should we Remove a Model at ${xCoord} ${yCoord} `,
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
          if (votingPower < 2000) {
            toast.warning("You need atleast 2000 voting power.");
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
  //       title: `Remove ${xCoord}, ${yCoord} from the Model build`,
  //       body: reason,
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
      <h1 className={styles.header}>Remove Model Build Node</h1>
      <p className={styles.paragraph}>
        To propose the removal of a Model Build node, please provide the
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
        </div>

        <label className={styles.label}>Reason for Removal (optional)</label>
        <textarea
          className={`form-control shadow-none ${styles.textarea}`}
          placeholder="Explain why this Model Build node should be removed. Provide any relevant details or reasons for the removal."
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
  );
};

export default Remove;
