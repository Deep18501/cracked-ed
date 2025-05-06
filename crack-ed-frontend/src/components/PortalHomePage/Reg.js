import React, { useState, useEffect, useContext } from 'react';
import './Reg.css';
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from "../../context/AuthContext.js";
import { LoadingComponent } from '../../components/LoadingComponent.js';
import OtpInput from '../../utils/otp_input.js';

const RegistrationForm = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const authContext = useContext(AuthContext);
  const { authLoading } = useContext(AuthContext);

  const handleFieldChange = ({ name, value }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log("Form Data:", formData);
  };

  const sendRegisterOtp = () => {
    authContext.sendRegisterOtp(formData.name, formData.email, formData.phone).then((response) => {
      console.log("OTP sent successfully:", response);
    }).catch((error) => {
      console.error("Error sending OTP:", error);
    });
  }

  const handleRegister = () => {
    authContext.register(formData.name, formData.email, formData.phone, otp).then((response) => {
      console.log("Register successfully:", response);
      navigate('/portal/dashboard');
    }).catch((error) => {
      console.error("Register Failed:", error);
    });
  }
  return (
    <div className="registration-container">
      {/* <h2 className="registration-title">Start your registration process today!</h2> */}

      <form className="registration-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Full Name"
            className="form-control"
            name="name"
            onChange={(e) => handleFieldChange({ name: "name", value: e.target.value })}
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            className="form-control"
            name="email"
            onChange={(e) => handleFieldChange({ name: "email", value: e.target.value })}
          />
        </div>

        <div className="form-group">
          <div className="mobile-input-group">
            <input
              type="text"
              placeholder="Mobile Number"
              className="form-control"
              name="phone"
              onChange={(e) => handleFieldChange({ name: "phone", value: e.target.value })}
            />
            <button
              type="button"
              className="btn-get-otp"
              onClick={sendRegisterOtp}
            >
              GET OTP
            </button>
          </div>
        </div>

        <div className="form-group">
          <p className="otp-instruction">Enter OTP sent to your mobile number</p>
          <div className='otp-container'>
            <OtpInput length={4} onChange={(val) => setOtp(val)} />

          </div>
        </div>
        <button type="submit" className="btn-submit-createac" onClick={handleRegister}>
          Create Account
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;