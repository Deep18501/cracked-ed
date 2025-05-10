import React, { useState, useEffect, useContext } from 'react';
import PortalHeader from "../components/PortalHeader.js";
import '../styles/portal.css';
import CustomTextField from '../utils/custom_textfield.js';
import OtpInput from '../utils/otp_input.js';
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext.js";
import { LoadingComponent } from '../components/LoadingComponent.js';

const PortalRegisterPage = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const authContext = useContext(AuthContext);
    const { authLoading } = useContext(AuthContext);  // Correctly access getApplicationData from DataContext
    const [showOtp, setShowOtp] = useState(false);


    useEffect(() => {
        if (!authContext.loading) {
            if (authContext.isAuthenticated) {
                navigate("/portal/dashboard");
            }
        }
    }, [authContext.isAuthenticated, authContext.loading]);

    const handleFieldChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        console.log("Form Data:", formData);
    };

    const sendLoginOtp = () => {
        const { name, email, phone } = formData;
        let errors=[];
        if(!name||!email || !phone){
          authContext.setAuthError({"type":"error","message":"All Fields are Required."});
          return;
        }
        if (!name.trim()) errors.push({"type":"error","message":"Name is required."});
        if (!email.trim()) errors.push({"type":"error","message":"Email is required."});
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push({"type":"error","message":"Invalid email format."});
      
        if (!phone.trim()) errors.push({"type":"error","message":"Phone Number is required."});
        else if (!/^\d{10}$/.test(phone)) errors.push({"type":"error","message":"Phone must be 10 digits."});
      
        if (errors.length > 0) {
          console.log("Errors ",errors);
          authContext.setAuthError(errors[0]);
          return;
        }
        
        authContext.sendRegisterOtp(formData.name, formData.email, formData.phone).then((response) => {
            if(response){
                console.log("OTP successfully:",);
                setShowOtp(true);
              }
        }).catch((error) => {
            console.error("Error sending OTP:", error);
        });
    }

    const handleRegister = () => {


        const { name, email, phone } = formData;
        if (!name || !email || !phone) {
            authContext.setAuthError({ "type": "error", "message": "All Fields are Required." });
            return;
        }

        let errors = [];

        if (!name.trim()) errors.push({ "type": "error", "message": "Name is required." });
        if (!email.trim()) errors.push({ "type": "error", "message": "Email is required." });
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push({ "type": "error", "message": "Invalid email format." });

        if (!phone.trim()) errors.push({ "type": "error", "message": "Phone Number is required." });
        else if (!/^\d{10}$/.test(phone)) errors.push({ "type": "error", "message": "Phone must be 10 digits." });

        if (!otp.trim()) errors.push({ "type": "error", "message": "OTP is required." });
        else if (otp.trim().length !== 4 || !/^\d{4}$/.test(otp.trim())) errors.push({ "type": "error", "message": "OTP must be 4 digits." });

        if (errors.length > 0) {
            console.log("Errors ", errors);
            authContext.setAuthError(errors[0]);
            return;
        }

        authContext.register(formData.name, formData.email, formData.phone, otp).then((response) => {
            if(response){
                console.log("Register successfully:");
                setShowOtp(false);
                navigate('/portal/dashboard');
              }
        }).catch((error) => {
            console.error("Register Failed:", error);
        });
    }

    return (
        <>
            <PortalHeader >
                <nav className="nav-links">
                    <a href="/portal" className="nav-link">Home</a>
                </nav>
                <button className="logout-button" onClick={() => navigate('/portal/login')}>Login</button>
            </PortalHeader>
            {authLoading ? <LoadingComponent /> : null}
            <div className="portal-container">
                <div className="portal-form-container">
                    <div className='portal-form-title'>
                        Register
                    </div>
                    <div className="portal-form-card">
                        <form>
                            <CustomTextField label="Full Name" name="name" type="text" onChange={handleFieldChange} readOnly={showOtp}/>
                            <CustomTextField label="Email" name="email" type="email" onChange={handleFieldChange} readOnly={showOtp}/>
                            <CustomTextField
                                label="Mobile Number"
                                name="phone" type="text"
                                onChange={handleFieldChange}
                                tail={true}
                                readOnly={showOtp}
                                tailContent={<div className='sendOtpButton' onClick={sendLoginOtp}>GET OTP</div>}>
                            </CustomTextField>

                           {showOtp && <div className='otp-container'>
                                <div className='enter-otp-text'>Enter OTP sent to your mobile number</div>

                                <OtpInput length={4} onChange={(val) => setOtp(val)} />

                            </div>}
                            <div className='portal-btn' onClick={handleRegister} >Register</div>
                        </form>

                    </div>
                </div>

            </div>
        </>
    );
}

export default PortalRegisterPage;