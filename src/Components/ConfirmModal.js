import React from "react";
import "./ConfirmModal.css";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-btn">
            Yes
          </button>
          <button onClick={onCancel} className="cancel-btn">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
