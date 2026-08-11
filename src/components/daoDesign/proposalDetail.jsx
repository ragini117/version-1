import Link from "next/link";
import { IoCopyOutline, IoCheckmarkSharp } from "react-icons/io5";
import styles from "./proposalDetail.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import snapshot from "@snapshot-labs/snapshot.js";
import { Web3Provider } from "@ethersproject/providers";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import { multiSignContract, multiSignContractAbi } from "@/abi/Abi";
import { useSelector } from "react-redux";
import Head from "next/head";
import { getVotingPower } from "./votingPower";
import Loader from "../../components/loaderDesign/index";

const ProposalDetail = () => {
    const { loginReducer } = useSelector((res) => res);
    const params = useParams();
    const router = useRouter();
    const id = params.slug;
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [recieptId, setReceiptId] = useState("");
    const [userVotes, setUserVotes] = useState(0);
    const [totalVotes, setTotalVotes] = useState(0);
    const [proposalId, setProposalId] = useState("");
    const [coountVotes, setCountvotes] = useState("");
    const [reason, setReason] = useState("");
    const [showReasonInput, setShowReasonInput] = useState(false);
    const [executed, setExecuted] = useState();
    const [poiModelName, setPoiModelName] = useState("");
    const [xCoordinate, setXCoordinate] = useState("");
    const [yCoordinate, setYCoordinate] = useState("");
    const [proposalType, setProposalType] = useState("");
    const [isAdmin, setIsAdmin] = useState();
    const [banName, setBanName] = useState("");
    const [hasVoted, setHasVoted] = useState(false);
    const [voteType, setVoteType] = useState(null);
    const [communityAddress, setCommunityAddress] = useState("");
    const [hasAdminVoted, setHasAdminVoted] = useState(false);
    const [executionSuccess, setExecutionSuccess] = useState(false);
    const [userNameHiring, setUserNameHiring] = useState("");
    const [deletable, setDeletable] = useState(false);
    const [copiedWallet, setCopiedWallet] = useState(false);
    const [votingResults, setVotingResults] = useState({
        yes: { percentage: 0, votes: 0, userCount: 0 },
        no: { percentage: 0, votes: 0, userCount: 0 },
        abstain: { percentage: 0, votes: 0, userCount: 0 },
        thresholdReached: false,
        minimumVP: 0,
    });
    // console.log("proposalId", proposalId);

    const fetchProposalById = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`/DAO/proposal/${id}`);
            if (response.data.status) {
                const fetchedProposal = response.data.data;
                setProposal(fetchedProposal);
                setProposalId(fetchedProposal.Id);
                setProposalType(fetchedProposal.type);
                setUserNameHiring(fetchedProposal.userName);
                setCommunityAddress(fetchedProposal.adminAddress);
                setReceiptId(fetchedProposal?.receipt?.id);
                setXCoordinate(parseInt(fetchedProposal.x));
                setYCoordinate(parseInt(fetchedProposal.y));
                setPoiModelName(fetchedProposal.modelName);
                setBanName(fetchedProposal.name);
                setDeletable(response.data.deletable === true);
                setHasVoted(response.data.hasVoted === true);
                setVoteType(response.data.voteType || null);
            } else {
                setError("Failed to fetch proposal");
            }
        } catch (error) {
            setError("Error fetching proposal");
        } finally {
            setLoading(false);
        }
        setLoading(false);
    };
    const checkAdmin = async () => {
        try {
            const account = localStorage.getItem("address");
            // console.log("Account from localStorage:", account);
            if (!account) {
                setIsAdmin(false);
                return false;
            }
            const accountLower = account.toLowerCase();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const daoMember = new ethers.Contract(
                multiSignContract,
                multiSignContractAbi,
                signer,
            );
            const adminAddresses = await daoMember.getDAOMembers();
            const adminAddressesLower = adminAddresses.map((addr) =>
                addr.toLowerCase(),
            );
            if (adminAddressesLower.includes(accountLower)) {
                setIsAdmin(true);
            } else {
                // console.log("Account is not found in admin addresses");
                setIsAdmin(false);
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
            setIsAdmin(false);
        }
    };

    const fetchVotingResults = async () => {
        try {
            const votingResultsEndpoint = await axios.get(
                `/DAO/getVotingWithUserCount/${id}`,
            );
            const votingResultsResponse = votingResultsEndpoint;

            if (votingResultsResponse.data.status) {
                const { votes, percentages, userCounts, totalVotingPower } =
                    votingResultsResponse.data;
                const thresholdReached = votes.yes >= 100000;
                setVotingResults({
                    yes: { percentage: percentages.yes, votes: votes.yes, userCount: userCounts.yes },
                    no: { percentage: percentages.no, votes: votes.no, userCount: userCounts.no },
                    abstain: {
                        percentage: percentages.abstain,
                        votes: votes.abstain,
                        userCount: userCounts.abstain,
                    },
                    thresholdReached: thresholdReached,
                    minimumVP: 2,
                });
            } else {
                console.error(
                    "Failed to fetch voting results:",
                    votingResultsResponse.data.message,
                );
            }
        } catch (error) {
            console.error("Error fetching voting results:", error.message);
        }
    };
    const fetchAdminVote = async (proposalId) => {
        if (!proposalId) {
            console.log("proposalId is not available");
            return;
        }

        try {
            const response = await axios.get(
                `/DAO/getAdminVote?proposalId=${proposalId}`,
            );
            // console.log("Response:", response.data);
            setExecuted(response.data?.data?.exicuted);
            // setCountVotes(response.data.data?.count || 0);
        } catch (error) {
            console.error("Error fetching admin vote:", error);
        }
    };
    const connectWallet = async () => {
        if (!selectedOption) {
            toast.error("Please select a vote option.");
            return;
        }
        if (!window.ethereum) {
            toast.error("MetaMask not detected.");
            return;
        }
        setLoading(true);
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3 = new Web3Provider(window.ethereum);
            const accounts = await web3.listAccounts();
            const account = accounts[0];

            if (!account) {
                toast.error("No wallet account found. Please unlock MetaMask and try again.");
                setLoading(false);
                return;
            }

            // Fetch VP — fail open so RPC issues don't block voting
            let votingPower = 0;
            try {
                votingPower = await getVotingPower(account, proposal.blockNumber);
            } catch (vpErr) {
                toast.warn("Could not fetch your voting power — your vote will still be submitted.");
            }

            const signer = web3.getSigner();
            const message = {
                voter: account,
                proposalId: proposalId,
                choice: selectedOption.toLowerCase(),
                timestamp: Date.now(),
            };

            let signature;
            try {
                signature = await signer.signMessage(JSON.stringify(message, null, 1));
            } catch (signErr) {
                if (signErr.code === 4001 || signErr.code === "ACTION_REJECTED") {
                    toast.error("You rejected the signature request in MetaMask.");
                } else {
                    toast.error("Signature failed: " + signErr.message);
                }
                setLoading(false);
                return;
            }

            const apiResponse = await axios.post("/DAO/vote", {
                votingPower,
                voteType: selectedOption.toLowerCase(),
                receipt: signature,
                accountId: account,
                proposalId: proposalId,
            });

            if (apiResponse.data.status) {
                toast.success("Vote recorded successfully!");
                await fetchVotingResults();
            } else {
                toast.error(apiResponse.data.message || "Failed to record vote.");
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Unknown error";
            if (error.code === 4001 || error.code === "ACTION_REJECTED") {
                toast.error("You rejected the request in MetaMask.");
            } else {
                toast.error("Could not vote: " + msg);
            }
        } finally {
            setLoading(false);
        }
    };

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
    //             "0x6e39f4E0De487a3BF77029f653dA7240FaA1eD2d",
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

    const handleVote = () => {
        const accountId = loginReducer?.userDetail?.accountId || localStorage.getItem("address");
        if (!accountId) {
            toast.error("Please connect your wallet address in your profile before voting.");
            return;
        }

        if (selectedOption) {
            connectWallet();
        } else {
            toast.error(`You need at least ${votingResults.minimumVP} VP to vote`);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
        };
        return date.toLocaleDateString("en-US", options);
    };

    const publishedDate = proposal ? formatDate(proposal.startDate) : "";
    const votingBeginsDate = proposal ? formatDate(proposal.startDate) : "";
    const votingEndsDate = proposal ? formatDate(proposal.endDate) : "";

    const getSnapshotProposalUrl = (receiptId) => {
        return `https://snapshot.org/#/decentrawood.eth/proposal/${receiptId}`;
    };

    const truncateId = (id) => {
        return id ? `${id.substring(0, 7)}...` : "";
    };

    const stripTags = (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };
    const handleFavor = async () => {
        try {
            const account = localStorage.getItem("address");
            if (!account) {
                throw new Error("No account found");
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const daoMember = new ethers.Contract(
                multiSignContract,
                multiSignContractAbi,
                signer,
            );

            if (!recieptId) {
                throw new Error("Receipt ID is undefined or null");
            }

            const adminAddresses = await daoMember.approve(recieptId);

            if (!adminAddresses || !adminAddresses.hash) {
                throw new Error(
                    "Failed to get valid hash from approve function",
                );
            }

            const payload = {
                accountId: account,
                proposalId: proposal.Id,
                status: "Favour",
                message: "Favor",
                receipt: {
                    hash: adminAddresses.hash,
                },
            };

            const response = await axios.post("/DAO/adminVote", payload);
            if (response.status === 200) {
                toast.success("Vote submitted successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                });

                localStorage.setItem(`voted_${proposal.Id}`, "favor");
                setHasAdminVoted(true);
            } else {
                throw new Error("Failed to submit vote");
            }
        } catch (error) {
            toast.error(`Error during voting: ${error.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const handleRevokedProposal = async () => {
        debugger;
        try {
            const account = localStorage.getItem("address");
            if (account) {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum,
                );
                const signer = provider.getSigner();
                const daoMember = new ethers.Contract(
                    multiSignContract,
                    multiSignContractAbi,
                    signer,
                );
                const adminAddresses = await daoMember.reject(recieptId);

                const payload = {
                    accountId: account,
                    proposalId: proposal.Id,
                    status: "Against",
                    message: "Against",
                    receipt: {
                        hash: adminAddresses.hash,
                    },
                };

                const response = await axios.post("/DAO/adminVote", payload);
                toast.success("Vote submitted successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                });

                // Store the vote status
                localStorage.setItem(`voted_${proposal.Id}`, "against");
                setHasAdminVoted(true);
                setUserVotes(userVotes + 1);
                setTotalVotes(totalVotes + 1);
            }
        } catch (error) {
            console.error("Error during voting:", error);
            toast.error("Error during voting", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const handleReasonSubmit = async () => {
        debugger;
        try {
            if (reason.trim() === "") {
                alert("Please enter a reason for voting against.");
                return;
            }
            const account = localStorage.getItem("account");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const revokedProposalsContract = new ethers.Contract(
                multiSignContract,
                multiSignContractAbi,
                signer,
            );
            const result = await revokedProposalsContract.revoke(recieptId);
            console.log("Result:", result);
            const payload = {
                account: account,
                proposalId: proposal.Id,
                message: `${reason}`,
                status: "Rejected",
                receipt: {
                    hash: result.hash,
                },
            };
            const response = await axios.post("/DAO/adminVote", payload);
            console.log("Admin Against API Response:", response.data);
            toast.success("Admin voted", {
                position: toast.POSITION.TOP_RIGHT,
            });
            setReason("");
            setShowReasonInput(false);
        } catch (error) {
            console.error("Error during voting:", error);
            toast.error("Error during voting");
        }
    };
    const handleFavorAndExecute = async () => {
        try {
            setLoading(true);

            switch (proposalType) {
                case "ban_name":
                    await executeBanName();
                    break;
                case "remove_name":
                    await executeUnBanName();
                    break;
                case "poi":
                    await executeAddPOI();
                    break;
                case "remove_poi":
                    await executeRemovePOI();
                    break;
                case "build_model":
                    await executeBuildModel();
                    break;
                case "hiring":
                    await executeHiringModel();
                    break;
                case "remove_hiring":
                    await executeRemoveHiringModel();
                    break;
                default:
                    setError("Unsupported proposal type");
                    break;
            }
        } catch (error) {
            console.error("Error during favor & execute:", error);
            setError("Error during favor & execute");
            toast.error("Error during favor & execute", {
                position: toast.POSITION.TOP_RIGHT,
            });
        } finally {
            setLoading(false);
        }
    };
    const executeHiringModel = async () => {
        setLoading(true);
        debugger;
        try {
            const account = localStorage.getItem("address");
            if (!account) {
                throw new Error("No account found in local storage");
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const daoMember = new ethers.Contract(
                multiSignContract,
                multiSignContractAbi,
                signer,
            );

            // Ensure proposal.userName is the address to be added
            const tx = await daoMember.addDAOCommunityMember(
                recieptId,
                communityAddress,
            );
            await tx.wait();

            const payload = {
                proposalId: proposal.Id,
                message: reason ? `Favor: ${reason}` : "Favor",
                receipt: {
                    hash: tx.hash,
                },
                status: "Enacted",
            };

            const token = localStorage.getItem("_auth_token");
            const response = await axios.post(
                "http://localhost:5000/DAO/hiringAdminVote",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.status) {
                setExecutionSuccess(true);
                toast.success("Hiring proposal executed successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            } else {
                throw new Error(
                    response.data.message || "Failed to submit vote",
                );
            }
        } catch (error) {
            toast.error(`Error during executeHiringModel: ${error.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        } finally {
            setLoading(false);
        }
    };

    const executeRemoveHiringModel = async () => {
        setLoading(true);
        try {
            const account = localStorage.getItem("address");
            if (!account) {
                throw new Error("No account found in local storage");
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const daoMember = new ethers.Contract(
                multiSignContract,
                multiSignContractAbi,
                signer,
            );

            const tx = await daoMember.removeDAOCommunityMember(
                recieptId,
                communityAddress,
            );
            await tx.wait();

            const payload = {
                proposalId: proposal.Id,
                message: reason ? `Favor: ${reason}` : "Favor",
                receipt: {
                    hash: tx.hash,
                },
                status: "Favour",
            };

            const token = localStorage.getItem("_auth_token");
            const response = await axios.post(
                "http://localhost:5000/DAO/remove-comety-member",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.status) {
                setExecutionSuccess(true);
                toast.success("Remove hiring proposal executed successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            } else {
                throw new Error(
                    response.data.message || "Failed to submit vote",
                );
            }
        } catch (error) {
            toast.error(
                `Error during executeRemoveHiringModel: ${error.message}`,
                {
                    position: toast.POSITION.TOP_RIGHT,
                },
            );
        } finally {
            setLoading(false);
        }
    };
    const executeBanName = async () => {
        try {
            const account = localStorage.getItem("address");
            if (account) {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum,
                );
                const signer = provider.getSigner();
                const daoMember = new ethers.Contract(
                    multiSignContract,
                    multiSignContractAbi,
                    signer,
                );
                const result = await daoMember.executeBanName(
                    recieptId,
                    banName,
                );
                console.log("Result:", result);
                const payload = {
                    accountId: account,
                    proposalId: proposalId,
                    message: reason !== "" ? `Favor: ${reason}` : "Favor",
                    status: "Enacted",
                    receipt: {
                        hash: result.hash,
                    },
                };
                const response = await axios.post("/DAO/adminVote", payload);
                console.log("Admin Vote API Response:", response.data);
                setExecutionSuccess(true);
                toast.success("Favor & Execute action completed successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        } catch (error) {
            console.error("Error during executeBanName:", error);
            toast.error("Error during executeBanName", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };
    const executeUnBanName = async () => {
        debugger;
        try {
            const account = localStorage.getItem("address");
            if (account) {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum,
                );
                const signer = provider.getSigner();
                const daoMember = new ethers.Contract(
                    multiSignContract,
                    multiSignContractAbi,
                    signer,
                );
                const result = await daoMember.executeUnBanName(
                    recieptId,
                    banName,
                );
                console.log("Result:", result);
                const payload = {
                    accountId: account,
                    proposalId: proposalId,
                    message: reason !== "" ? `Favor: ${reason}` : "Favor",
                    status: "Enacted",
                    receipt: {
                        hash: result.hash,
                    },
                };
                const response = await axios.post("/DAO/adminVote", payload);
                console.log("Admin Vote API Response:", response.data);
                setExecutionSuccess(true);
                toast.success("Favor & Execute action completed successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        } catch (error) {
            console.error("Error during executeUnBanName:", error);
            toast.error("Error during executeUnBanName", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const executeAddPOI = async () => {
        debugger;
        try {
            const account = localStorage.getItem("address");
            if (account) {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum,
                );
                const signer = provider.getSigner();
                const daoMember = new ethers.Contract(
                    multiSignContract,
                    multiSignContractAbi,
                    signer,
                );
                const result = await daoMember.executeAddPOI(
                    recieptId,
                    poiModelName,
                );
                console.log("Result:", result);

                const payload = {
                    accountId: account,
                    proposalId: proposalId,
                    message: reason !== "" ? `Favor: ${reason}` : "Favor",
                    status: "Enacted",
                    receipt: {
                        hash: result.hash,
                    },
                };

                const response = await axios.post("/DAO/adminVote", payload);
                console.log("Admin Vote API Response:", response.data);
                setExecutionSuccess(true);
                toast.success("Favor & Execute action completed successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                // toast.success("Vote submitted successfully", {
                //   position: toast.POSITION.TOP_RIGHT,
                // });
            }
        } catch (error) {
            console.error("Error during executeAddPOI:", error);
            toast.error("Error during executeAddPOI", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const executeRemovePOI = async () => {
        try {
            const account = localStorage.getItem("address");
            if (account) {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum,
                );
                const signer = provider.getSigner();
                const daoMember = new ethers.Contract(
                    multiSignContract,
                    multiSignContractAbi,
                    signer,
                );
                const result = await daoMember.executeRemovePOI(recieptId);
                console.log("Result:", result);

                const payload = {
                    accountId: account,
                    proposalId: proposalId,
                    message: reason !== "" ? `Favor: ${reason}` : "Favor",
                    status: "Enacted",
                    receipt: {
                        hash: result.hash,
                    },
                };

                const response = await axios.post("/DAO/adminVote", payload);
                console.log("Admin Vote API Response:", response.data);
                await checkingVoted();
                setExecutionSuccess(true);
                toast.success("Favor & Execute action completed successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        } catch (error) {
            console.error("Error during executeRemovePOI:", error);
            toast.error("Error during executeRemovePOI", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };
    const executeBuildModel = async () => {
        try {
            const account = localStorage.getItem("address");
            if (account) {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum,
                );
                const signer = provider.getSigner();
                const daoMember = new ethers.Contract(
                    multiSignContract,
                    multiSignContractAbi,
                    signer,
                );
                const result = await daoMember.executeBuildModel(
                    recieptId,
                    modelName,
                    account,
                );
                console.log("Result:", result);

                const payload = {
                    accountId: account,
                    proposalId: proposalId,
                    message: reason !== "" ? `Favor: ${reason}` : "Favor",
                    status: "Enacted",
                    receipt: {
                        hash: result.hash,
                    },
                };

                const response = await axios.post("/DAO/adminVote", payload);
                console.log("Admin Vote API Response:", response.data);
                setExecutionSuccess(true);
                toast.success("Favor & Execute action completed successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        } catch (error) {
            console.error("Error during executeAddPOI:", error);
            toast.error("Error during executeAddPOI", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const handleReasonChange = (event) => {
        setReason(event.target.value);
    };

    const handleDeleteProposal = async () => {
        if (!window.confirm("Are you sure you want to delete this proposal? This cannot be undone.")) return;
        setLoading(true);
        try {
            const response = await axios.delete(`/DAO/deleteProposal/${id}`, {
                headers: { Authorization: `Bearer ${loginReducer?.userDetail?.token}` },
            });
            if (response.data.status) {
                toast.success("Proposal deleted successfully.");
                router.push("/dao/proposal");
            } else {
                toast.error(response.data.message || "Failed to delete proposal.");
            }
        } catch (error) {
            toast.error("Error deleting proposal: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!proposalId) return; // Early exit if no proposalId

        const votedStatus = localStorage.getItem(`voted_${proposalId}`);
        if (votedStatus) {
            setHasAdminVoted(true);
        }
    }, [proposalId]);
    useEffect(() => {
        if (proposalId) {
            fetchAdminVote(proposalId);
        }
    }, [proposalId]);
    useEffect(() => {
        checkAdmin();
    }, []);
    useEffect(() => {
        fetchProposalById();
        fetchVotingResults();
    }, [id]);
    useEffect(() => {
        if (loginReducer?.isLogin) {
            axios.defaults.headers.common["Authorization"] =
                `Bearer ${loginReducer?.userDetail?.token}`;
        }
    }, [loginReducer]);
    const getProposalTitle = () => {
        if (!proposal) return "Loading proposal...";
        const t = proposal.type;
        if (t === "poi")           return `Add the location ${proposal.modelName} to the Points of Interest`;
        if (t === "remove_poi")    return `Remove the location ${proposal.modelName} from the Points of Interest`;
        if (t === "ban_name")        return `Ban the name ${proposal.modelName}`;
        if (t === "remove_banName") return `Remove ban on the name ${proposal.modelName}`;
        if (t === "remove_name")    return `Remove the name ${proposal.name}`;
        if (t === "build_model")   return `Build model ${proposal.modelName}`;
        if (t === "remove_model")  return `Remove model ${proposal.modelName}`;
        if (t === "hiring")        return `Add ${proposal.userName} to DAO Committee`;
        if (t === "remove_hiring") return `Remove ${proposal.userName} from DAO Committee`;
        if (t === "poll")          return proposal.question || proposal.modelName;
        return proposal.modelName || "Proposal";
    };

    const endDate = proposal ? new Date(proposal.endDate) : null;
    const now = new Date();
    const daysLeft = endDate ? Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)) : null;

    const voteConfig = [
        { key: "yes",     label: "Yes",     labelClass: styles.voteLabelYes,     barClass: styles.progressYes,     optClass: styles.voteOptionYes,     icon: "✓" },
        { key: "no",      label: "No",      labelClass: styles.voteLabelNo,      barClass: styles.progressNo,      optClass: styles.voteOptionNo,      icon: "✗" },
        { key: "abstain", label: "Abstain", labelClass: styles.voteLabelAbstain, barClass: styles.progressAbstain, optClass: styles.voteOptionAbstain, icon: "–" },
    ];

    return (
        <>
            <Head>
                <title>Decentrawood DAO — Proposal Detail</title>
                <meta name="description" content="View the details of this Decentrawood DAO proposal." />
            </Head>
            {loading && <Loader loading={loading} />}

            <div className={styles.pageWrapper}>
                {/* ── Navbar ── */}
                <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className={`nav-link ${styles.navbar_cus_item}`} href="/dao">DAO Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${styles.navbar_cus_item}`} href="/dao/proposal/">Proposals</Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* ── Hero header ── */}
                <div className={styles.proposalHeader}>
                    {/* Title + time pill */}
                    <div className={styles.headerTop}>
                        <h1 className={styles.proposalTitle}>{getProposalTitle()}</h1>
                        {daysLeft !== null && (
                            <div className={styles.timeRemaining}>
                                <span>⏱</span>
                                {daysLeft > 0 ? `${daysLeft} days left` : "Voting ended"}
                            </div>
                        )}
                    </div>

                    {/* Status + type badges */}
                    <div className={styles.headerBadgesRow}>
                        <div className={styles.headerBadges}>
                            <span className={`${styles.badgeStatus} ${
                                proposal?.status === "Expired" ? styles.badgeExpired
                                : proposal?.status === "Enacted" ? styles.badgeEnacted
                                : proposal?.status === "Passed" ? styles.badgePassed
                                : ""
                            }`}>
                                {typeof proposal?.status === "object"
                                    ? JSON.stringify(proposal?.status)
                                    : proposal?.status || "Active"}
                            </span>
                            {proposal?.type && (
                                <span className={styles.badgeType}>
                                    {proposal.type.replace(/_/g, " ")}
                                </span>
                            )}
                        </div>
                        {deletable && (
                            <button
                                className={styles.deleteBtn}
                                onClick={handleDeleteProposal}
                                disabled={loading}
                            >
                                🗑 Delete Proposal
                            </button>
                        )}
                    </div>

                    {/* Meta strip — author, dates, receipt */}
                    <div className={styles.metaStrip}>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Author</span>
                            <span className={styles.metaValue}>
                                {proposal?.authorName || proposal?.userName || "—"}
                            </span>
                            {proposal?.accountId && (
                                <span className={styles.metaWalletRow}>
                                    <span className={styles.metaWallet}>
                                        {proposal.accountId.slice(0, 6)}...{proposal.accountId.slice(-6)}
                                    </span>
                                    <button
                                        className={styles.copyBtn}
                                        title="Copy address"
                                        onClick={() => {
                                            navigator.clipboard.writeText(proposal.accountId);
                                            setCopiedWallet(true);
                                            setTimeout(() => setCopiedWallet(false), 2000);
                                        }}
                                    >
                                        {copiedWallet
                                            ? <IoCheckmarkSharp size={13} color="#34d399" />
                                            : <IoCopyOutline size={13} />}
                                    </button>
                                </span>
                            )}
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Published</span>
                            <span className={styles.metaValue}>{publishedDate || "—"}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Voting Ends</span>
                            <span className={styles.metaValue}>{votingEndsDate || "—"}</span>
                        </div>
                        {proposal?.receipt && (
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Snapshot</span>
                                <a
                                    href={getSnapshotProposalUrl(proposal.receipt)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.snapshotLink}
                                >
                                    #{truncateId(proposal.receipt)}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Main 2-column layout ── */}
                <div className={styles.contentArea}>

                    {/* ════ LEFT — Description + Admin ════ */}
                    <div>
                        <div className={styles.glassCard}>
                            <span className={styles.sectionLabel}>Description</span>
                            <p className={styles.descriptionText}>
                                {stripTags(
                                    proposal?.type === "hiring" || proposal?.type === "remove_hiring"
                                        ? proposal?.reason
                                        : proposal?.description
                                ) || "No description provided."}
                            </p>
                        </div>

                        {isAdmin && (
                            <div className={styles.glassCard}>
                                <span className={styles.sectionLabel}>Admin Actions</span>
                                <div className={styles.adminActions}>
                                    {!hasAdminVoted ? (
                                        <>
                                            <button className={styles.favorBtn} onClick={handleFavor} disabled={loading}>Favor</button>
                                            <button className={styles.againstBtn} onClick={handleRevokedProposal} disabled={loading}>Against</button>
                                        </>
                                    ) : (
                                        <span className={styles.alreadyVoted}>You have already voted</span>
                                    )}
                                    {proposalType === "hiring" && (
                                        <button className={styles.executeBtn} onClick={executeHiringModel} disabled={loading}>
                                            Favor &amp; Execute Hiring
                                        </button>
                                    )}
                                    {proposalType === "remove_hiring" && (
                                        <button className={styles.executeBtn} onClick={executeRemoveHiringModel} disabled={loading}>
                                            Favor &amp; Execute Removal
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {showReasonInput && (
                            <div className={styles.glassCard}>
                                <label htmlFor="reasonInput" className={styles.reasonLabel}>Reason for voting against</label>
                                <input
                                    type="text"
                                    id="reasonInput"
                                    className={styles.reasonInput}
                                    value={reason}
                                    onChange={handleReasonChange}
                                    placeholder="Enter your reason here..."
                                />
                                <button className={styles.reasonSubmitBtn} onClick={handleReasonSubmit}>
                                    Submit Reason
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ════ RIGHT — Results + Vote (sticky) ════ */}
                    <div className={styles.rightCol}>
                        {/* Voting Results */}
                        <div className={styles.glassCard}>
                            <span className={styles.sectionLabel}>Current Results</span>
                            {voteConfig.map(({ key, label, labelClass, barClass }) => (
                                <div key={key} className={styles.voteRow}>
                                    <div className={styles.voteRowHeader}>
                                        <span className={labelClass}>{label}</span>
                                        <span className={labelClass}>{votingResults[key]?.percentage ?? 0}%</span>
                                    </div>
                                    <div className={styles.progressTrack}>
                                        <div className={barClass} style={{ width: `${votingResults[key]?.percentage ?? 0}%` }} />
                                    </div>
                                    <div className={styles.voteRowMeta}>
                                        <span>{(votingResults[key]?.votes ?? 0).toFixed(2)} VP</span>
                                        <span>{votingResults[key]?.userCount ?? 0} votes</span>
                                    </div>
                                </div>
                            ))}
                            <div className={votingResults.thresholdReached ? styles.thresholdReached : styles.thresholdMissed}>
                                {votingResults.thresholdReached ? "✓ 200k VP Threshold reached!" : "✗ 200k VP Threshold not reached"}
                            </div>
                        </div>

                        {/* Cast Your Vote */}
                        {proposal?.status !== "Passed" && daysLeft > 0 && (
                            <div className={styles.glassCard}>
                                <span className={styles.sectionLabel}>Cast Your Vote</span>
                                {hasVoted ? (
                                    <div className={styles.alreadyVotedBanner}>
                                        <span className={styles.alreadyVotedIcon}>✓</span>
                                        <div>
                                            <p className={styles.alreadyVotedText}>You already voted</p>
                                            {voteType && (
                                                <p className={styles.alreadyVotedChoice}>
                                                    Your choice: <strong style={{ textTransform: "capitalize" }}>{voteType}</strong>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className={styles.voteOptions}>
                                            {voteConfig.map(({ label, optClass, icon }) => (
                                                <button
                                                    key={label}
                                                    onClick={() => setSelectedOption(label)}
                                                    className={`${styles.voteOption} ${optClass} ${selectedOption === label ? styles.voteOptionSelected : ""}`}
                                                >
                                                    <span>{icon}</span> {label}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            className={styles.submitVoteBtn}
                                            onClick={handleVote}
                                            disabled={!selectedOption || loading}
                                        >
                                            {loading ? "Submitting..." : "Submit Vote"}
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <ToastContainer />
            </div>
        </>
    );
};

export default ProposalDetail;
