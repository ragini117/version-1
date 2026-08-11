import React from "react";
import styles from "./profileDesign.module.css";
import { ThreeDots } from "react-loader-spinner";

const ApproveModal = ({
  showModal,
  setShowModal,
  handleProceed,
  handleApprove,
  proceed,
  setProceed,
  spineLoading,
}) => {
  return (
    <>
      <div
        className={`modal fade${showModal ? " show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content bg-dark text-light ">
            <div className="modal-header" data-bs-theme="dark">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Proceed with wallet
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={() => (setProceed(null), setShowModal(false))}
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              In order to continue you will need to authorize the Marketplace
              contract to operate <span style={{ color: "#ec6bff" }}>DEOD</span>{" "}
              tokens on your behalf
            </div>
            {!proceed && (
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className={`${styles.ApproveBtn}`}
                  onClick={handleApprove}
                >
                  {!spineLoading ? (
                    <div className="ms-2">Approve</div>
                  ) : (
                    <ThreeDots
                      visible={true}
                      height="25"
                      width="30"
                      color="#7a62f9"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperclassName=""
                    />
                  )}
                </button>
              </div>
            )}
            {proceed && (
              <div className="modal-footer justify-content-end">
                <button
                  type="button"
                  className={`${styles.ProceedBtn}`}
                  onClick={handleProceed}
                >
                  Proceed
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApproveModal;
