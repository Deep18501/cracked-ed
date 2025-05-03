import React, { useState,useEffect, useContext } from 'react';
import PortalHeader from "../components/PortalHeader";
import '../styles/portal.css';
import CustomTextField from '../utils/custom_textfield.js';
import OtpInput from '../utils/otp_input.js';
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext";

const PortalLoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const authContext = useContext(AuthContext);


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
        setLoading(true);
        authContext.sendLoginOtp(formData.phone).then((response) => {
            console.log("OTP sent successfully:", response);
            setLoading(false);

        }).catch((error) => {
            console.error("Error sending OTP:", error);
            setLoading(false);
        });
    }

    const handleRegister = () => {
        setLoading(true);
        authContext.login(formData.phone, otp).then((response) => {
            console.log("login successfully:", response);
            navigate('/portal/dashboard');
            setLoading(false);
        }).catch((error) => {
            console.error("login Failed:", error);
            setLoading(false);
        });
    }

    return (
        <>
            <PortalHeader >
                <nav className="nav-links">
                    <a href="/" className="nav-link">Home</a>
                </nav>
                <button className="logout-button" onClick={() => navigate('/portal/register')}>Register</button>
            </PortalHeader>
            <div className="portal-container">
                <div className="portal-form-container">
                    <div className='portal-form-title'>

                        Login
                    </div>
                    <div className="portal-form-card">
                        <form>
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
                            <div className='portal-btn' onClick={handleRegister} >Login</div>
                        </form>

                    </div>
                </div>

            </div>
        </>
    );
}

export default PortalLoginPage;