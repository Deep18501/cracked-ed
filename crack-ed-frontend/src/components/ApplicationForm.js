import React from "react";
import "../styles/application_form.css";
import { useContext } from "react";
import { DataContext } from "../context/DataContext.js"; 

const ApplicationForm = () => {

    const {  applicationData } = useContext(DataContext);  // Correctly access getApplicationData from DataContext
    
  return (
    <div className="application-form-container">
      {/* Header */}
      <div className="header">
        <p>
          <span className="label-bold">Candidate Name: </span> {applicationData?applicationData.first_name+applicationData.last_name:"Deepanshu Kaushik"}
        </p>
        <p>
          <span className="label-bold">Application Number:</span>{applicationData?applicationData.application_id:"Loading"}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button className="tab-active">Personal Details</button>
        <button className="tab">Education & Experience</button>
        <button className="tab">Documents</button>
        <button className="tab">Preview</button>
        <button className="tab">Payment</button>
      </div>

      {/* Form Sections */}
      <form className="form-section">
        {/* Personal Details Section */}
        <div className="section-box">
          <h2 className="section-title">Personal Details</h2>
          <div className="grid-container">
            <Input label="First Name"  required />
            <Input label="Middle Name" />
            <Input label="Last Name" required />
            <Input label="Mobile Number" required />
            <Input label="Email" required />
            <Input label="Date of Birth" required />
            <Input label="PAN Card Number" required />
            <Input label="Gender" required />
            <Input label="Family Annual Income" required />
          </div>
        </div>

        {/* Address Section */}
        <div className="section-box">
          <h2 className="section-title">Address</h2>
          <div className="grid-container">
            <Input label="Address" required />
            <Input label="State" required />
            <Input label="District" required />
            <Input label="City" required />
            <Input label="Pincode" required />
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-footer">
          <button type="submit" className="submit-button">Next</button>
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, required }) => (
  <div className="input-group">
    <label className="input-label">
      {label} {required && <span className="required">*</span>}
    </label>
    <input type="text" className="input-field" />
  </div>
);

export default ApplicationForm;
