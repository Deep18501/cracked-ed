import React, { useState, useEffect, useContext } from 'react';
import PortalHeader from "../components/PortalHeader.js";
import '../styles/portal.css';
import CustomTextField from '../utils/custom_textfield.js';
import OtpInput from '../utils/otp_input.js';
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext.js";
import { DataContext } from "../context/DataContext.js";
import ApplicationCard from '../components/ApplicationCard.js';
import ApplicationForm from '../components/ApplicationForm.js';

const PortalApplicationPage = () => {
    const [loading, setLoading] = useState(false);

    const authContext = useContext(AuthContext);
    const dataContext = useContext(AuthContext);
    const { getApplicationData, applicationData } = useContext(DataContext);  // Correctly access getApplicationData from DataContext

    const navigate = useNavigate();




    const handleLogout = () => {

        setLoading(true);
        authContext.logout();
        console.log("Logout successfully");
        setLoading(false);
        navigate('/portal/login');
    }
   
    useEffect(() => {
        if (!authContext.loading) {
            if (!authContext.isAuthenticated) {
                navigate("/portal/login");
            }
        }
    }, [authContext.isAuthenticated, authContext.loading]);


    return (
        <>
            <PortalHeader >
                <nav className="nav-links">
                    <a href="/portal" className="nav-link">Home</a>
                    <a href="/portal/dashboard" className="nav-link">Dashboard</a>
                </nav>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </PortalHeader>
            <div className='application-form'>

                <ApplicationForm />

            </div>
        </>
    );
}

export default PortalApplicationPage;