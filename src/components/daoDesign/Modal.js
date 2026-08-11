"use client";
import React, { useState } from "react";
import { BiLocationPlus } from "react-icons/bi";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { MdOutlinePersonAdd } from "react-icons/md";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Modal.module.css";

const Modal = ({ proposal, onClose, onAction, adminAddresses }) => {
  const [message, setMessage] = useState("");

  // Check conditions to disable actions
  const canAddPoi = proposal.title === "Point of Interest";
  const canRemovePoi = proposal.title === "Point of Interest";
  const canAddHiring = proposal.title === "Hiring";
  const canRemoveHiring = proposal.title === "Hiring" && adminAddresses.length > 2;

  const handleAddAction = () => {
    if (proposal.title === "Point of Interest") {
      if (canAddPoi) {
        onAction("Add");
      } else {
        setMessage("Add action is not available for Point of Interest.");
        toast.error("Add action is not available for Point of Interest.");
      }
    } else if (proposal.title === "Hiring") {
      if (canAddHiring) {
        onAction("Add");
      } else {
        setMessage("Add action is not available for Hiring.");
        toast.error("Add action is not available for Hiring.");
      }
    } else {
      onAction("Add");
    }
  };

  const handleRemoveAction = () => {
    if (proposal.title === "Point of Interest") {
      if (canRemovePoi) {
        onAction("Remove");
      } else {
        setMessage("Remove action is not available for Point of Interest.");
        toast.error("Remove action is not available for Point of Interest.");
      }
    } else if (proposal.title === "Hiring") {
      if (canRemoveHiring) {
        onAction("Remove");
      } else {
        setMessage("Remove action is not available for Hiring.");
        toast.error("Remove action is not available for Hiring.");
      }
    } else {
      onAction("Remove");
    }
  };

  const renderModalContent = () => {
    if (proposal.modalActions.includes("Add") || proposal.modalActions.includes("Remove")) {
      return (
        <>
          {proposal.modalActions.includes("Add") && (
            <div
              className={`${styles.modalActionSection} ${styles.actionAdd}`}
              onClick={handleAddAction}
              style={{
                pointerEvents: proposal.title === "Point of Interest" ? (canAddPoi ? "auto" : "none") : (proposal.title === "Hiring" ? (canAddHiring ? "auto" : "none") : "auto"),
                opacity: proposal.title === "Point of Interest" ? (canAddPoi ? 1 : 0.8) : (proposal.title === "Hiring" ? (canAddHiring ? 1 : 0.8) : 1),
              }}
            >
              <div className={styles.actionIconAdd}>
                {proposal.title === "Point of Interest" ? (
                  <BiLocationPlus size={24} color="#00c853" />
                ) : (
                  <MdOutlinePersonAdd size={24} color="#00c853" />
                )}
              </div>
              <div>
                <h2 className={styles.modalActionTitle}>
                  Add {proposal.title}{" "}
                  {proposal.title === "Point of Interest" && !canAddPoi && (
                    <p className={styles.disabledMessage}>Not available</p>
                  )}
                  {proposal.title === "Hiring" && !canAddHiring && (
                    <p className={styles.disabledMessage}>Not available</p>
                  )}
                </h2>
                <p>{proposal.description}</p>
              </div>
            </div>
          )}
          {proposal.modalActions.includes("Remove") && (
            <div
              className={`${styles.modalActionSection} ${styles.actionRemove}`}
              onClick={handleRemoveAction}
              style={{
                pointerEvents: proposal.title === "Point of Interest" ? (canRemovePoi ? "auto" : "none") : (proposal.title === "Hiring" ? (canRemoveHiring ? "auto" : "none") : "auto"),
                opacity: proposal.title === "Point of Interest" ? (canRemovePoi ? 1 : 0.8) : (proposal.title === "Hiring" ? (canRemoveHiring ? 1 : 0.8) : 1),
              }}
            >
              <div className={styles.actionIconRemove}>
                {proposal.title === "Point of Interest" ? (
                  <AiOutlineMinusCircle size={24} color="#d32f2f" />
                ) : (
                  <IoPersonRemoveOutline size={24} color="#d32f2f" />
                )}
              </div>
              <div>
                <h2 className={styles.modalActionTitle}>
                  Remove {proposal.title}
                  {proposal.title === "Point of Interest" && !canRemovePoi && (
                    <p className={styles.disabledMessage}>Not available.</p>
                  )}
                  {proposal.title === "Hiring" && !canRemoveHiring && (
                    <p className={styles.disabledMessage}>Not available.</p>
                  )}
                </h2>
                <p>
                  Suggest to demote a specific DAO member from their Committee
                  duties.
                </p>
              </div>
            </div>
          )}
        </>
      );
    }
    return <p>{proposal.description}</p>;
  };

  return (
    <div>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
          <h2 className={styles.modalTitle}>{proposal.title}</h2>
          <p className={styles.modalSubtitle}>What would you like to do?</p>
          {renderModalContent()}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Modal;
