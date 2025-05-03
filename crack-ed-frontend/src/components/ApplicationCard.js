import React from 'react';
import '../styles/application_card.css'; // import the styles

const ApplicationCard = ({ appNumber, candidateName, program, status, onResume }) => {
  return (
    <div className="application-card">
      <div className="application-details">
        <div className="column">
          <div className="label">Application Number</div>
          <div className="value">{appNumber}</div>
        </div>
        <div className="column">
          <div className="label">Candidate Name</div>
          <div className="value">{candidateName}</div>
        </div>
        <div className="column">
          <div className="label">Program</div>
          <div className="value">{program}</div>
        </div>
        <div className="column">
          <div className="label">Application Status</div>
          <div className="value">{status}</div>
        </div>
      </div>
      <button className="resume-btn" onClick={onResume}>Resume Application</button>
    </div>
  );
};

export default ApplicationCard;
