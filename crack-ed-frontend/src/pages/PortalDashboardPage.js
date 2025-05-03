import React, { useState,useEffect ,useContext} from 'react';
import PortalHeader from "../components/PortalHeader.js";
import '../styles/portal.css';
import CustomTextField from '../utils/custom_textfield.js';
import OtpInput from '../utils/otp_input.js';
import {Link, useNavigate} from 'react-router-dom'
import { AuthContext } from "../context/AuthContext.js";
import { DataContext } from "../context/DataContext.js";
import ApplicationCard from '../components/ApplicationCard.js';


const PortalDashboardPage = () => {
    const [loading, setLoading] = useState(false);

    const authContext = useContext(AuthContext);
    const dataContext = useContext(AuthContext);
    const { getApplicationData,applicationData } = useContext(DataContext);  // Correctly access getApplicationData from DataContext

    const navigate = useNavigate();   
        



    const handleLogout = () => {

        setLoading(true);
        authContext.logout();
        console.log("Logout successfully");
            setLoading(false);
            navigate('/portal/login');
    }   
    const handleResume = () => {
            navigate('/portal/application-form');
    }
    useEffect(() => {
        if (!authContext.loading) { 
          if (!authContext.isAuthenticated) {
            navigate("/portal/login");
          }
        }
      }, [authContext.isAuthenticated, authContext.loading]);

      useEffect(() => {
        getApplicationData();
      }, []);

        useEffect(() => {
        console.log("Application Data dash:", applicationData);
          }, [applicationData]);

    return (
        <>
      <PortalHeader > 
        <nav className="nav-links">
        <a href="/" className="nav-link">Home</a>
        <a href="/portal/dashboard" className="nav-link">Dashboard</a>
      </nav>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      </PortalHeader>
    <div className='application-cards'>
      <ApplicationCard
        appNumber={applicationData?applicationData.application_id:"Loading"}
        candidateName={applicationData?applicationData.first_name+applicationData.last_name:"Deepanshu Kaushik"}
        program={applicationData?applicationData.program:"AURUM Banker Program"}
        status={applicationData?applicationData.status:"Started"}
        onResume={handleResume}  
      />
      </div>
        </>
    );
}

export default PortalDashboardPage;