import React, { useEffect } from 'react';
import '../styles/alert.css'; // Optional external styles

const Alert = ({ error, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getAlertClass = () => {
    switch (error.type) {
      case "success":
        return "alert alert-success";
      case "error":
        return "alert alert-error";
      case "warning":
        return "alert alert-warning";
      default:
        return "alert alert-info";
    }
  };

  return (
    <div className={getAlertClass()}>
      <span>{error.message}</span>
      {onClose && (
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
