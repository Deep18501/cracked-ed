import React, { useState, useEffect,useContext } from 'react';
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
        <>
            <PortalHeader >
                <nav className="nav-links">
                    <a href="/portal" className="nav-link">Home</a>
                </nav>
                <button className="logout-button" onClick={() => navigate('/portal/login')}>Login</button>
            </PortalHeader>
             {authLoading?<LoadingComponent/>:null}  
            <div className="portal-container">
                <div className="portal-form-container">
                    <div className='portal-form-title'>
                        Register
                    </div>
                    <div className="portal-form-card">
                        <form>
                            <CustomTextField label="Full Name" name="name" type="text" onChange={handleFieldChange} />
                            <CustomTextField label="Email" name="email" type="email" onChange={handleFieldChange} />
                            <CustomTextField
                                label="Mobile Number"
                                name="phone" type="text"
                                onChange={handleFieldChange}
                                tail={true}
                                tailContent={<div className='sendOtpButton' onClick={sendLoginOtp}>GET OTP</div>}>
                            </CustomTextField>
                            <div className='otp-container'>
                                <div className='enter-otp-text'>Enter OTP sent to your mobile number</div>

                                <OtpInput length={4} onChange={(val) => setOtp(val)} />

                            </div>
                            <div className='portal-btn' onClick={handleRegister} >Register</div>
                        </form>

                    </div>
                </div>

            </div>
        </>
    );
}

export default PortalRegisterPage;