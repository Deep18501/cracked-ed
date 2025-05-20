import React, { useState,useEffect, useContext } from 'react';
import PortalHeader from "../components/PortalHeader";
import '../styles/portal.css';
import CustomTextField from '../utils/custom_textfield.js';
import OtpInput from '../utils/otp_input.js';
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext";
import { LoadingComponent } from '../components/LoadingComponent.js';
import Alert from '../components/Alert.js';

const PortalLoginPage = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const authContext = useContext(AuthContext);
    const { authLoading } = useContext(AuthContext);  // Correctly access getApplicationData from DataContext
    const [error, setError] = useState(null);
    const [showOtp, setShowOtp] = useState(false);


    useEffect(() => {
        console.log("States - ", showOtp, " ", !authContext.loading, " ", authContext.isAuthenticated);
        if(showOtp){
            if (!authContext.loading) { 
              if (authContext.isAuthenticated) {
                setShowOtp(false);
                navigate("/portal/dashboard",{ state: { fromLogin: true } });
              }
            }
        }else{
            if (!authContext.loading) { 
              if (authContext.isAuthenticated) {
                navigate("/portal/dashboard");
              }
            }
        }
      }, [authContext.isAuthenticated, authContext.loading]);
      
 

      
    const handleFieldChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        console.log("Form Data:", formData);
    };

    const sendLoginOtp = () => {
        const { phone } = formData;
        let errors=[];
        if( !phone){
            authContext.setAuthError({"type":"error","message":"All Fields are Required."});
          return;
        }
          
        if (!phone.trim()) errors.push({"type":"error","message":"Phone Number is required."});
        else if (!/^\d{10}$/.test(phone)) errors.push({"type":"error","message":"Phone must be 10 digits."});
      
        if (errors.length > 0) {
          console.log("Errors ",errors);
          authContext.setAuthError(errors[0]);
          return;
        }

        authContext.sendLoginOtp(formData.phone).then((response) => {
            if(response){
                console.log("OTP sent successfully:", response);
                setShowOtp(true);
            }
        }).catch((error) => {
            console.error("Error sending OTP:", error);
        });
    }

    const handleRegister = () => {
        const { phone } = formData;
        let errors=[];
        if( !phone){
            authContext.setAuthError({"type":"error","message":"All Fields are Required."});
          return;
        }
          
        if (!phone.trim()) errors.push({"type":"error","message":"Phone Number is required."});
        else if (!/^\d{10}$/.test(phone)) errors.push({"type":"error","message":"Phone must be 10 digits."});
        
        if (!otp.trim()) errors.push({"type":"error","message":"OTP is required. Click on send OTP."});
        else if (otp.trim().length !== 4 || !/^\d{4}$/.test(otp.trim()))  errors.push({"type":"error","message":"OTP must be 4 digits."});
      
        if (errors.length > 0) {
          console.log("Errors ",errors);
          authContext.setAuthError(errors[0]);
          return;
        }
        authContext.login(formData.phone, otp).then((response) => {
            if(response){
                console.log("login successfully:", response);
                navigate('/portal/dashboard',{ state: { fromLogin: true } });
            }
        }).catch((error) => {
            console.error("login Failed:", error);
        });
    }

    return (
        <>
            <PortalHeader >
                <nav className="nav-links">
                    <a href="/portal" className="nav-link" onClick={() => navigate('/portal')}>Home</a>
                </nav>
                <button className="logout-button" onClick={() => navigate('/portal/register')}>Register</button>
            </PortalHeader>
            {authLoading?<LoadingComponent/>:null}  

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
                                readOnly={showOtp}
                                tailContent={<div className='sendOtpButton' onClick={sendLoginOtp}>GET OTP</div>}>
                            </CustomTextField>
                           
                            { showOtp && <div className='otp-container'>
                                <div className='enter-otp-text'>Enter OTP sent to your mobile number</div>
                                <OtpInput length={4} onChange={(val) => setOtp(val)} />
                            </div>
                            }

                            <div className='portal-btn' onClick={handleRegister} >Login</div>
                        </form>

                    </div>
                </div>

            </div>
        </>
    );
}

export default PortalLoginPage;