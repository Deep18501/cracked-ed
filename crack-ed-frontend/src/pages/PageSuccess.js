import React, { useState,useEffect ,useContext} from 'react';
import PortalHeader from '../components/PortalHeader';
import { useNavigate } from "react-router-dom";
import RegistrationFormThankYou from '../components/RegistrationFormThankYou';
import { AuthContext } from "../context/AuthContext.js";


const PageSuccess = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    const handleGotoDashboard = () => {
        navigate("/portal/dashboard");
    }
    const handleLogout = () => {
        authContext.logout();
        console.log("Logout successfully");
      navigate('/portal/login');
    }   
    return (
        <>
            <PortalHeader >
                <nav className="nav-links">
                    <a href="/portal" className="nav-link">Home</a>
                    <a href="/portal/dashboard" className="nav-link">Dashboard</a>
                </nav>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </PortalHeader>
            <RegistrationFormThankYou />
            {/* <div className="form-footer">
                <button
                    type="button"
                    className="back-button"
                    onClick={handleGotoDashboard}
                >
                    Go to Dashboard
                </button>
            </div> */}
        </>
    );
}

export default PageSuccess;

