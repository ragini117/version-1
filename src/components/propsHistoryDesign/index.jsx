import React, { useEffect, useState } from "react";
import styles from "./propsHistoryDesign.module.css";
import axios from "axios";
import { apiUrl } from "../../../environment";
import Loader from "../../components/loaderDesign/index";
const page = () => {
  const transactions = [
    {
      id: 1,
      locationName: "Rama Mandir",
      eventType: "RamMandir Aarti-Diya",
      totalDeod: 200,
      ownerAmount: 190,
      adminAmount: 10,
      validityPeriod: "unlimited",
      status: "Completed",
      transactionDate: "2024-01-11T10:16:31.249Z",
    },
    {
      id: 2,
      locationName: "Tirupathi Balaji Temple",
      eventType: "Balaji Pushpanjali Thali",
      totalDeod: 200,
      ownerAmount: 190,
      adminAmount: 10,
      validityPeriod: "unlimited",
      status: "completed",
      transactionDate: "2024-01-11T10:16:31.249Z",
    },
    {
      id: 3,
      locationName: "Tirupathi Balaji Temple",
      eventType: "Balaji Pushpanjali Thali",
      totalDeod: 200,
      ownerAmount: 190,
      adminAmount: 10,
      validityPeriod: "unlimited",
      status: "completed",
      transactionDate: "2024-01-11T10:16:31.249Z",
    },
    {
      id: 4,
      locationName: "Tirupathi Balaji Temple",
      eventType: "Balaji Pushpanjali Thali",
      totalDeod: 200,
      ownerAmount: 190,
      adminAmount: 10,
      validityPeriod: "unlimited",
      status: "completed",
      transactionDate: "2024-01-11T10:16:31.249Z",
    },
    {
      id: 5,
      locationName: "Tirupathi Balaji Temple",
      eventType: "Balaji Pushpanjali Thali",
      totalDeod: 200,
      ownerAmount: 190,
      adminAmount: 100,
      validityPeriod: "unlimited",
      status: "completed",
      transactionDate: "2024-01-11T10:16:31.249Z",
    },
  ];
  const [allTransactionData, setAllTransactionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleGetTransactionData = async () => {
    setLoading(true);
    try {
      const api = `${apiUrl}/payment/payment-history`;
      const res = await axios.get(api);
      if (res?.data?.status === true) {
        setAllTransactionData(res?.data?.data);
      }
    } catch (error) {
      console.log("error in transaction history");
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGetTransactionData();
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div className={styles["card-container"]}>
        <div className={`card ${styles.cus_cardtbl}`}>
          <h4 className={styles["header"]}>Props Transaction History</h4>
          {allTransactionData.length === 0 ? (
            <p className={styles["no-transaction-msg"]}>
              You don't have any transactions yet.
            </p>
          ) : (
            <div className={`table-responsive`}>
              <table className={styles["transaction-table"]}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Location Name</th>
                    <th>Event Type</th>
                    <th>Total Deod</th>
                    <th>Owner Amount</th>
                    <th>Admin Amount</th>
                    <th>Validity Period</th>
                    <th>Status</th>
                    <th>Transaction Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allTransactionData.map((transaction, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{transaction.modelName}</td>
                      <td>{transaction.propName}</td>
                      <td>{transaction.deodPrice}</td>
                      <td>{transaction.ownerAmount}</td>
                      <td>{transaction.adminAmount}</td>
                      <td>{transaction.validityPeriod}</td>
                      <td>{transaction.paymentStatus}</td>
                      <td>{transaction.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default page;
