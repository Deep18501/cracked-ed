import React from "react";
import "../styles/confirm-payment-popup.css"; // Optional: Use for custom styling
import warning_icon from "../assets/warning_icon.png"


const ConfirmPaymentPopup = ({ onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-icon">
          <img className="icon-circle" src={warning_icon}/>
        </div>
        <div className="modal-title">Ready to Proceed?</div>
        <p className="modal-description">
          Once you move to the payment section, you won’t be able to edit your details. Please double-check everything before continuing.
        </p>
        <div className="modal-actions">
          <button className="btn-outline" onClick={onClose}>
            Edit Details
          </button>
          <button className="btn-filled" onClick={onConfirm}>
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPaymentPopup;