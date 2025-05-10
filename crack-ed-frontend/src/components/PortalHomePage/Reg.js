import React, { useState, useEffect, useContext } from 'react';
import './Reg.css';
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from "../../context/AuthContext.js";
import { LoadingComponent } from '../../components/LoadingComponent.js';
import OtpInput from '../../utils/otp_input.js';
import Alert from '../../components/Alert.js';

const RegistrationForm = () => {
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const authContext = useContext(AuthContext);
  const { authLoading, authError, setAuthError } = useContext(AuthContext);  // Correctly access getApplicationData from DataContext
  const [error, setError] = useState(null);


   useEffect(() => {
      if (authError) {
        setError(authError);
      }
      setAuthError(null);
    }, [authError]);

  const handleFieldChange = ({ name, value }) => {
 
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log("Form Data:", formData);
  };

  const sendRegisterOtp = () => {
      
    const { name, email, phone } = formData;
    let errors=[];
    if(!name||!email || !phone){
      setAuthError({"type":"error","message":"All Fields are Required."});
      return;
    }
    if (!name.trim()) errors.push({"type":"error","message":"Name is required."});
    if (!email.trim()) errors.push({"type":"error","message":"Email is required."});
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push({"type":"error","message":"Invalid email format."});
  
    if (!phone.trim()) errors.push({"type":"error","message":"Phone Number is required."});
    else if (!/^\d{10}$/.test(phone)) errors.push({"type":"error","message":"Phone must be 10 digits."});
  
    if (errors.length > 0) {
      console.log("Errors ",errors);
      setAuthError(errors[0]);
      return;
    }
  
    authContext.sendRegisterOtp(formData.name, formData.email, formData.phone).then((response) => {
      if(response){
        console.log("OTP successfully:",);
        setShowOtp(true);
      }
    })
    .catch((error) => {
      console.error("Register Failed:", error);
      setAuthError({"type":"error","message":`Registration Failed: ${error}}`});
    });
  }

  const handleRegister = (e) => {
    e.preventDefault();
  
    const { name, email, phone } = formData;
    if(!name||!email || !phone){
      setAuthError({"type":"error","message":"All Fields are Required."});
      return;
    }
    
    let errors=[];

    if (!name.trim()) errors.push({"type":"error","message":"Name is required."});
    if (!email.trim()) errors.push({"type":"error","message":"Email is required."});
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push({"type":"error","message":"Invalid email format."});
  
    if (!phone.trim()) errors.push({"type":"error","message":"Phone Number is required."});
    else if (!/^\d{10}$/.test(phone)) errors.push({"type":"error","message":"Phone must be 10 digits."});
  
    if (!otp.trim()) errors.push({"type":"error","message":"OTP is required."});
    else if (otp.trim().length !== 4 || !/^\d{4}$/.test(otp.trim()))  errors.push({"type":"error","message":"OTP must be 4 digits."});
  
    if (errors.length > 0) {
      console.log("Errors ",errors);
      setAuthError(errors[0]);
      return;
    }

    authContext.register(name, email, phone, otp)
      .then((response) => {
        if(response){
          console.log("Register successfully:");
          setShowOtp(false);
          navigate('/portal/dashboard');
        }
      })
      .catch((error) => {
        console.error("Register Failed:", error);
        setAuthError({"type":"error","message":`Registration Failed: ${error}}`});
      });
  };
  

  return (
    <div className="registration-container">
      {/* <h2 className="registration-title">Start your registration process today!</h2> */}
        {authLoading?<LoadingComponent/>:null}  
        {error && <Alert error={error} onClose={() => setError(null)} />}

      <form className="registration-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Full Name"
            className="form-control"
            name="name"
            readOnly={showOtp}
            onChange={(e) => handleFieldChange({ name: "name", value: e.target.value })}
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            className="form-control"
            name="email"
            readOnly={showOtp}
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
              readOnly={showOtp}
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

       { showOtp &&<div className="form-group">
          <p className="otp-instruction">Enter OTP sent to your mobile number</p>
          <div className='otp-container'>
            <OtpInput length={4} onChange={(val) => setOtp(val)} />
          </div>
        </div>}
        <button type="submit" className="btn-submit-createac" onClick={handleRegister}>
          Create Account
        </button>
      </form>

    </div>
    
  );
};

export default RegistrationForm;