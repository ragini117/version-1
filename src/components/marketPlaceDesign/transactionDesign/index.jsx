import React, { useState } from "react";
import styles from "./transactionDesign.module.css";

const Index = () => {
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

  return (
    <div className={styles["card-container"]}>
      <div className={`card ${styles.cus_cardtbl}`}>
        <h1 className={styles["header"]}>Transaction </h1>
        {transactions.length === 0 ? (
          <p className={styles["no-transaction-msg"]}>
            You don't have any transactions yet.
          </p>
        ) : (
          <div className={`table-responsive`} >
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
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.locationName}</td>
                    <td>{transaction.eventType}</td>
                    <td>{transaction.totalDeod}</td>
                    <td>{transaction.ownerAmount}</td>
                    <td>{transaction.adminAmount}</td>
                    <td>{transaction.validityPeriod}</td>
                    <td>{transaction.status}</td>
                    <td>{transaction.transactionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
