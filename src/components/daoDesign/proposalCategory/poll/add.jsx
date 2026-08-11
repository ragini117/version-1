"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../DaoForm.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { Web3Provider } from "@ethersproject/providers";
import { useSelector } from "react-redux";
// import { getVotingPower } from "../../votingPower";

const Add = () => {
    const [question, setQuestion] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { loginReducer } = useSelector((res) => res);
    const accountId = loginReducer?.userDetail?.accountId;
    const router = useRouter();

    useEffect(() => {
        if (loginReducer?.isLogin) {
            axios.defaults.headers.common["Authorization"] =
                `Bearer ${loginReducer?.userDetail?.token}`;
        }
    }, [loginReducer]);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) throw new Error("MetaMask not detected");
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3 = new Web3Provider(window.ethereum);
            const latestBlockNumber = await web3.getBlockNumber();
            const accounts = await web3.listAccounts();
            const account = accounts[0].toLowerCase();

            const storedAccount = accountId || localStorage.getItem("address");
            if (account !== storedAccount) {
                throw new Error("Connected account does not match the stored account.");
            }

            // const vp = await getVotingPower(account, latestBlockNumber);
            // if (vp < 2000) {
            //     throw new Error(`Insufficient voting power. You have ${Math.floor(vp)} VP but need at least 2,000 VP to create a poll.`);
            // }

            const message = {
                proposer: account,
                title: `DAO Poll: ${question}`,
                description,
                timestamp: Date.now(),
                blockNumber: latestBlockNumber,
            };
            const signer = await web3.getSigner();
            const signature = await signer.signMessage(JSON.stringify(message, null, 1));

            return { address: account, receipt: signature, blockNumber: latestBlockNumber };
        } catch (error) {
            console.error("Error connecting wallet:", error.message);
            throw error;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (submitting) return;
        setSubmitting(true);

        try {
            if (!loginReducer?.isLogin) {
                toast.error("Please log in to submit a poll.");
                return;
            }

            if (!accountId && !localStorage.getItem("address")) {
                toast.error("Please connect your wallet in your profile before submitting a poll.");
                return;
            }

            const receipt = await connectWallet();

            const response = await axios.post("/DAO/createPoll", {
                modelName: question,
                description,
                receipt: receipt.receipt,
                blockNumber: receipt.blockNumber,
            });

            if (response.data.status) {
                toast.success("Poll proposal submitted successfully.");
                router.push("/dao/proposal");
                setQuestion("");
                setDescription("");
            } else {
                toast.error("Failed to submit poll: " + response.data.message);
            }
        } catch (error) {
            console.error("Error submitting poll:", error);
            toast.error("Error submitting poll: " + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
          <div className={styles.formCard}>
            <h1 className={styles.header}>Create a Poll</h1>
            <p className={styles.paragraph}>
                The purpose of the Poll is to introduce a governance issue to the community, gauge community sentiment, and determine if there is enough support to move forward with the drafting of an initial proposal. Polls can only pass to the Draft stage if they have accumulated a threshold of at least 200k VP
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label}>Poll Question</label>
                <p className={styles.paragraph}>
                    Write a clear, concise question for the community to answer.
                </p>
                <input
                    className={`form-control shadow-none ${styles.input}`}
                    type="text"
                    placeholder="e.g. Should we add a new feature to the platform?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                />

                <label className={styles.label}>Description</label>
                <p className={styles.paragraph}>
                    Provide context or background information to help members
                    make an informed choice.
                </p>
                <textarea
                    className={`form-control shadow-none ${styles.textarea}`}
                    placeholder="Explain the purpose of this poll..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <div className={styles.button_box}>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : "Submit Poll"}
                    </button>
                </div>
            </form>
            <ToastContainer />
          </div>
        </div>
    );
};

export default Add;
