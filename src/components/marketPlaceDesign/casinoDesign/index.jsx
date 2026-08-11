import axios from "axios";
import { ethers } from "ethers";
import styles from "./casinoDesign.module.css";
import React, { useEffect, useState } from "react";
import {
  deodTokenContract,
  deodTokenContractAbi,
  rouletteContract,
  rouletteContractABI,
} from "@/abi/Abi";
import { Grid } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { apiUrl } from "../../../../environment";
import ProfileImg from "../../../../public/assets/Pic-3.png";

const page = () => {
  const router = useRouter();
  const [isToggled, setIsToggled] = useState(0);
  const [balanceData, setBalanceData] = useState({});
  const [transactionHistory, setTransactionHistory] = useState({});
  const [gameHistory, setGameHistory] = useState({});
  const [amount, setAmount] = useState(null);
  const [loader, setLoader] = useState(false);
  const [reward, setReward] = useState(0);
  //  const transactionHistory = {
  //     status: true,
  //     message: "Transaction history by User",
  //     results: [
  //       {
  //         accountId: "0xf913ce781dc10cbbe2f431b4f8fa65f1dbf27576",
  //         userName: "avi9984",
  //         amount: 5000,
  //         asset: "deod",
  //         type: "Deposit",
  //         trasactionHash: "1234567890sdfghjklcvbk",
  //         depositDate: "2024-03-12T07:36:59.847Z",
  //         USDpr: "7.370",
  //       },
  //       {
  //         accountId: "0xf913ce781dc10cbbe2f431b4f8fa65f1dbf27576",
  //         userName: "avi9984",
  //         amount: 5,
  //         asset: "deod",
  //         type: "Withdraw",
  //         trasactionHash: "123456709876edfghjk",
  //         withdrawalDate: "2024-03-12T07:25:25.298Z",
  //         USDpr: "0.007",
  //       },
  //       {
  //         accountId: "0xf913ce781dc10cbbe2f431b4f8fa65f1dbf27576",
  //         userName: "avi9984",
  //         amount: 50,
  //         asset: "deod",
  //         type: "Deposit",
  //         trasactionHash: "1234567890sdfghjklcvbk",
  //         depositDate: "2024-03-12T07:20:46.131Z",
  //         USDpr: "0.077",
  //       },
  //       {
  //         accountId: "0xf913ce781dc10cbbe2f431b4f8fa65f1dbf27576",
  //         userName: "avi9984",
  //         amount: 50,
  //         asset: "deod",
  //         type: "Deposit",
  //         trasactionHash: "1234567890sdfghjklcvbk",
  //         depositDate: "2024-03-12T07:20:42.341Z",
  //         USDpr: "0.077",
  //       },
  //     ],
  //     pagination: {
  //       totalItems: 4,
  //       currentPage: 1,
  //       totalPages: 1,
  //     },
  //   };
  // const gameHistory = {
  //   status: true,
  //   message: "Get all game history",
  //   results: [
  //     {
  //       accountId: "0xf913ce781dc10cbbe2f431b4f8fa65f1dbf27576",
  //       gameType: "Roulette",
  //       gameStatus: "Win",
  //       bets: [
  //         {
  //           12: "10",
  //           20: "10",
  //           0: "10",
  //         },
  //       ],
  //       outcomes: {
  //         8: "10",
  //       },
  //       amount: 20,
  //       time: "2024-03-12T07:46:28.246Z",
  //       USDpr: "0.029",
  //     },
  //     {
  //       accountId: "0xf913ce781dc10cbbe2f431b4f8fa65f1dbf27576",
  //       gameType: "Roulette",
  //       gameStatus: "Win",
  //       bets: {
  //         12: "10",
  //         20: "10",
  //         0: "10",
  //       },
  //       outcomes: {
  //         9: "10",
  //       },
  //       amount: 20,
  //       time: "2024-03-12T07:47:27.590Z",
  //       USDpr: "0.029",
  //     },
  //     {
  //       accountId: "0xf913ce781dc10cbbe2f431b4f8fa65f1dbf27576",
  //       gameType: "Roulette",
  //       gameStatus: "Win",
  //       bets: {
  //         12: "10",
  //         20: "10",
  //         0: "10",
  //       },
  //       outcomes: {
  //         0: "10",
  //       },
  //       amount: 20,
  //       time: "2024-03-12T08:00:57.334Z",
  //       USDpr: "0.029",
  //     },
  //     {
  //       accountId: "0xf913ce781dc10cbbe2f431b4f8fa65f1dbf27576",
  //       gameType: "Roulette",
  //       gameStatus: "cancel",
  //       amount: 30,
  //       time: "2024-03-12T08:06:36.301Z",
  //       USDpr: "0.044",
  //     },
  //     {
  //       accountId: "0xf913ce781dc10cbbe2f431b4f8fa65f1dbf27576",
  //       gameType: "Roulette",
  //       gameStatus: "cancel",
  //       amount: 30,
  //       time: "2024-03-12T08:07:29.684Z",
  //       USDpr: "0.044",
  //     },
  //     {
  //       accountId: "0xf913ce781dc10cbbe2f431b4f8fa65f1dbf27576",
  //       gameType: "Roulette",
  //       gameStatus: "Win",
  //       bets: {
  //         12: "10",
  //         20: "10",
  //         0: "10",
  //       },
  //       outcomes: {
  //         0: "10",
  //       },
  //       amount: 20,
  //       totalBetAmount: 30,
  //       time: "2024-03-12T11:58:17.378Z",
  //       USDpr: "0.029",
  //     },
  //     {
  //       accountId: "0xf913ce781dc10cbbe2f431b4f8fa65f1dbf27576",
  //       gameType: "Roulette",
  //       gameStatus: "Lose",
  //       bets: {
  //         12: "10",
  //         20: "10",
  //         0: "10",
  //       },
  //       outcomes: {
  //         0: "10",
  //       },
  //       amount: 20,
  //       totalBetAmount: 30,
  //       time: "2024-03-12T12:01:19.733Z",
  //       USDpr: "0.029",
  //     },
  //   ],
  //   pagination: {
  //     totalItems: 7,
  //     currentPage: 1,
  //     totalPages: 1,
  //   },
  // };
  //   const checkBalance = {
  //     status: true,
  //     message: "User balance",
  //     data: {
  //       accountId: "0xf913ce781dc10cbbe2f431b4f8fa65f1dbf27576",
  //       userName: "avi9984",
  //       amount: 5045,
  //       asset: "deod",
  //       USDpr: "7.436",
  //     },
  //   };
  const start_and_end = (address) => {
    if (address !== undefined) {
      return (
        address.substr(0, 10) +
        "...." +
        address.substr(address.length - 10, address.length)
      );
    }
    return address;
  };

  function getColorGroup(num) {
    if (num === 0) {
      return "green"; // Green for 0
    } else if ((num >= 1 && num <= 10) || (num >= 19 && num <= 28)) {
      return num % 2 === 0 ? "black" : "red"; // Black or red for 1-10 and 19-28
    } else {
      return num % 2 === 0 ? "red" : "black"; // Red or black for 11-18 and 29-36
    }
  }
  const fetchbalance = async () => {
    setLoader(true);
    try {
      const api = `${apiUrl}/casino/checkBalance`;
      const resp = await axios(api);
      setBalanceData(resp.data);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const roulette = new ethers.Contract(
        rouletteContract,
        rouletteContractABI,
        provider
      );
      const availablerewards = await roulette.rewardAvailableToCollect(
        address,
        "Roulette"
      );
      const a = ethers.utils.formatEther(availablerewards);
      setReward(a);
    } catch (error) {
      console.log(error);
    }
    setLoader(false);
  };
  const fetchGameHistory = async () => {
    try {
      const api = `${apiUrl}/play/gameHistory`;
      const resp = await axios(api);
      setGameHistory(resp.data);
    } catch (error) {
      console.log(error, "game");
    }
  };
  const fetchTransactionHistory = async () => {
    try {
      const api = `${apiUrl}/casino/getUserTransaction`;
      const resp = await axios(api);
      setTransactionHistory(resp.data);
    } catch (error) {
      console.log(error, "getUserTransaction");
    }
  };
  const handleDeposit = async (e) => {
    debugger;
    setLoader(true);
    e.preventDefault();
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const approvalContract = new ethers.Contract(
        deodTokenContract,
        deodTokenContractAbi,
        signer
      );

      const a = ethers.utils.parseUnits(amount, "ether").toString();
      console.log(a);
      const approvalTxn = await approvalContract.approve(rouletteContract, a);
      const receipttxn = await approvalTxn.wait();
      console.log(receipttxn);
      if (receipttxn.status !== 1) {
        alert("error message");
      } else {
        console.log("balanceData.refferedBy", balanceData?.data?.refferedBy);
        const roulette = new ethers.Contract(
          rouletteContract,
          rouletteContractABI,
          signer
        );
        const depositTxn = await roulette.depositTokens(
          "Roulette",
          balanceData?.data?.refferedBy || balanceData?.refferedBy,
          a
        );
        const reciept = await depositTxn.wait();
        if (reciept.status !== 1) {
          alert("error message");
        } else {
          const hash = await reciept.transactionHash;
          const api = `${apiUrl}/casino/deposit`;
          const payload = {
            amount: +amount,
            asset: "deod",
            trasactionHash: hash,
          };
          const resp = await axios.post(api, payload);
          console.log(resp);
          await fetchTransactionHistory();
          await fetchbalance();
          await fetchGameHistory();
          setAmount(0);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setLoader(false);
  };
  const handleWithdrawal = async (e) => {
    debugger;
    e.preventDefault();
    setLoader(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const roulette = new ethers.Contract(
        rouletteContract,
        rouletteContractABI,
        signer
      );
      const withdrawalTxn = await roulette.withdrawTokens(address, "Roulette");
      const reciept = await withdrawalTxn.wait();
      if (reciept.status !== 1) {
        alert("error message");
      } else {
        const hash = await reciept.transactionHash;
        const api = `${apiUrl}/casino/userWithdrawal`;
        const payload = {
          amount: +reward,
          asset: "deod",
          trasactionHash: hash,
        };
        const resp = await axios.post(api, payload);
        console.log(resp);
        await setAmount(0);
        await fetchbalance();
        await fetchTransactionHistory();
        await fetchGameHistory();
      }
    } catch (error) {
      console.log(error);
    }
    setLoader(false);
  };
  useEffect(() => {
    fetchbalance();
    fetchGameHistory();
    fetchTransactionHistory();
  }, []);

  return (
    <>
      {loader && (
        <>
          <div
            style={{
              position: "fixed",
              overflowY: "scroll",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 10,
              cursor: "pointer",
            }}
          ></div>
          <Grid
            visible={true}
            height="80"
            width="80"
            color="red"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{
              position: "fixed",
              top: "50%",
              left: "50%",
              zIndex: "10",
              overflowY: "scroll",
            }}
            wrapperclassName="grid-wrapper"
          />
        </>
      )}
      <div className={`${styles.main_profile_bg} mt-5 pt-5`}>
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="text-white">
              Casino <i className="fa-solid fa-dice " />
            </h2>
          </div>

          <div className="row justify-content-center align-items-center">
            <div className="col-md-9 col-11 rounded border border-secondary p-4">
              <div className="row align-items-center ">
                <div className="col-12 col-md-2">
                  <img
                    src="/assets/Pic-3.png"
                    className="rounded rounded-circle"
                    alt=""
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="col-12 col-md-10">
                  <div className="row align-items-center justify-content-between ">
                    <div className="col-12 col-md-6  ">
                      <h2 className={styles.username_style}>
                        {balanceData?.data?.userName}
                      </h2>
                      <span className="text-white">
                        {start_and_end(balanceData?.data?.accountId)}
                        <i className="fa-solid fa-copy mx-2"></i>
                      </span>
                    </div>
                    <div className="col-12 col-md-6  ">
                      <div className="d-flex justify-content-md-end justify-content-start my-1">
                        <button
                          className={`btn ${styles.cus_btn}`}
                          onClick={() =>
                            router.push(
                              "https://spiritualzone.s3.ap-south-1.amazonaws.com/Casino_Game/index.html"
                            )
                          }
                        >
                          Play Now
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="row my-2 justify-content-center justify-content-md-start">
                    <div className="d-flex align-items-center ">
                      <div className="text-white">
                        <strong>
                          Balance : {balanceData?.data?.amount} DEOD{" "}
                          <img
                            src="/assets/deod.png"
                            alt="logo"
                            style={{ height: "1rem" }}
                            className="bg-dark"
                          />
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="row ">
                    <div className="col-12 col-md-9 ">
                      <button
                        className={`btn ${styles.cus_btn} me-3 align-items-center`}
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Deposit <i className="bi bi-wallet mx-1" />
                      </button>
                      <button
                        className={`btn ${styles.cus_btn} me-3 align-items-center mt-md-0 mt-2`}
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal1"
                      >
                        Withdraw <i className="bi bi-cash-stack mx-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center align-items-center my-4">
            <div className="col-11 col-md-9">
              <div className="row justify-content-center align-items-center">
                <div className="col-md-9 col-12 btn-group border border-1 border-secondary">
                  <button
                    className={`${
                      isToggled === 0
                        ? "btn btn-dark shadow-none border-0"
                        : "btn btn-outline-secondary shadow-none border-0"
                    } fw-bold`}
                    onClick={() => setIsToggled(0)}
                  >
                    Transaction History
                  </button>
                  <button
                    className={`${
                      isToggled === 1
                        ? "btn btn-dark shadow-none border-0"
                        : "btn btn-outline-secondary shadow-none border-0"
                    } fw-bold`}
                    onClick={() => setIsToggled(1)}
                  >
                    Game History
                  </button>
                </div>
                <div className="col-md-4 col-6"></div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center align-items-center my-3 ">
            {isToggled == 0 ? (
              <>
                {transactionHistory.results ? (
                  <div className="table-responsive w-75">
                    {/* <div>
                  <h3>Transaction History</h3>
                </div> */}
                    <table className="table table-dark table-striped ">
                      <thead className="table-secondary">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Transaction Date</th>
                          <th scope="col">Type</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Hash</th>
                        </tr>
                      </thead>
                      <tbody className="table-group-divider border-secondary">
                        {transactionHistory?.results?.map((data, index) => (
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{data.depositDate || data.withdrawalDate}</td>
                            <td>
                              {data.type == "Withdraw" ? (
                                <div className="fw-bold">
                                  <i
                                    className="fa-solid fa-minus"
                                    style={{ color: "red" }}
                                  ></i>{" "}
                                  {data.type}{" "}
                                </div>
                              ) : (
                                <div className="fw-bold">
                                  <i
                                    className="fa-solid fa-plus"
                                    style={{ color: "green" }}
                                  ></i>{" "}
                                  {data.type}{" "}
                                </div>
                              )}
                            </td>
                            <td>
                              <div>
                                <img
                                  src="/assets/deod.png"
                                  alt="logo"
                                  style={{ height: "1rem" }}
                                  className="mx-1"
                                />
                                {data.amount}
                              </div>
                              <div>
                                <small className="text-secondary">
                                  <img
                                    src="/assets/ether-logo.svg"
                                    alt="logo"
                                    style={{ height: "1rem" }}
                                    className="mx-1 "
                                  />
                                  {data.USDpr}
                                </small>
                              </div>
                            </td>
                            <td>
                              <a
                                href={`https://BSCscan.com/tx/${data.trasactionHash}`}
                                target="_blank"
                              >
                                {start_and_end(data.trasactionHash)}
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <>No Data Found</>
                )}
              </>
            ) : (
              <>
                {gameHistory.results ? (
                  <div className="table-responsive w-75">
                    {/* <div>
                  <h3>Game History</h3>
                </div> */}
                    <table className="table table-dark table-striped">
                      <thead className="table-secondary">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Session Time</th>
                          <th scope="col">Type</th>
                          <th scope="col">Status</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Outcome</th>
                        </tr>
                      </thead>
                      <tbody className="table-group-divider border-secondary">
                        {gameHistory.results.map((data, index) => (
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{data.time}</td>
                            <td>{data.gameType}</td>
                            <td>
                              {data.gameStatus == "Win" ? (
                                <div className="fw-bold px-3 d-inline">
                                  {data.gameStatus}{" "}
                                  <i
                                    className="fa-solid fa-arrow-up"
                                    style={{ color: "green" }}
                                  ></i>
                                </div>
                              ) : data.gameStatus == "Lose" ? (
                                <div className="fw-bold  px-3 d-inline">
                                  {data.gameStatus}{" "}
                                  <i
                                    className="fa-solid fa-arrow-down"
                                    style={{ color: "red" }}
                                  ></i>
                                </div>
                              ) : (
                                <div className="fw-bold  px-3 d-inline">
                                  {data.gameStatus}
                                </div>
                              )}
                            </td>
                            <td>
                              <div>
                                <img
                                  src="/assets/deod.png"
                                  alt="logo"
                                  style={{ height: "1rem" }}
                                  className="mx-1"
                                />
                                {data.amount}
                              </div>
                              <div>
                                <small className="text-secondary">
                                  <img
                                    src="/assets/ether-logo.svg"
                                    alt="logo"
                                    style={{ height: "1rem" }}
                                    className="mx-1 "
                                  />
                                  {data.USDpr}
                                </small>
                              </div>
                            </td>

                            <td>
                              {data.outcomes &&
                                Object.keys(data.outcomes).map((key) => (
                                  <div
                                    style={{
                                      backgroundColor: `${getColorGroup(+key)}`,
                                      color: "white",
                                      display: "inline",
                                      borderRadius: "10px",
                                    }}
                                    className="px-3"
                                  >
                                    {key}
                                  </div>
                                ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <>No Data Found</>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/*deposit modal */}
      <div
        className="modal fade "
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog   ">
          <div className="modal-content bg-dark text-light ">
            <div className="modal-header" data-bs-theme="dark">
              <h1
                className="modal-title text-light fs-5"
                id="exampleModalLabel"
              >
                Deposit Balance
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form action="">
              <div className="modal-body">
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  min={10}
                  className="form-control bg-dark text-light"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className={`btn ${styles.close_btn}`}
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className={`btn ${styles.cus_btn}`}
                  onClick={handleDeposit}
                  data-bs-dismiss="modal"
                >
                  Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Withdraw Modal  */}
      <div
        className="modal fade "
        id="exampleModal1"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog   ">
          <div className="modal-content bg-dark text-light ">
            <div className="modal-header" data-bs-theme="dark">
              <h1
                className="modal-title text-light fs-5"
                id="exampleModalLabel"
              >
                Withdraw Rewards
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form action="">
              <div className="modal-body">
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  className="form-control bg-dark text-light"
                  placeholder="Available Rewards"
                  value={reward}
                  disabled
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className={`btn ${styles.close_btn}`}
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className={`btn ${styles.cus_btn}`}
                  onClick={handleWithdrawal}
                  data-bs-dismiss="modal"
                >
                  Withdraw
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
