import React, { useState,useEffect ,useContext} from 'react';
import PortalHeader from "../components/PortalHeader.js";
import '../styles/portal.css';
import CustomTextField from '../utils/custom_textfield.js';
import OtpInput from '../utils/otp_input.js';
import {Link, useNavigate} from 'react-router-dom'
import { AuthContext } from "../context/AuthContext.js";
import { DataContext } from "../context/DataContext.js";
import ApplicationCard from '../components/ApplicationCard.js';
import { LoadingComponent } from '../components/LoadingComponent.js';
import Alert from '../components/Alert.js';


const PortalDashboardPage = () => {


    const authContext = useContext(AuthContext);
    const dataContext = useContext(AuthContext);
    const { getApplicationData,applicationData,dataLoading } = useContext(DataContext);  // Correctly access getApplicationData from DataContext
    const { authLoading ,authError,setAuthError} = useContext(AuthContext);  // Correctly access getApplicationData from DataContext
    const [error, setError] = useState(null);

    const navigate = useNavigate();   
        



    const handleLogout = () => {
        authContext.logout();
        console.log("Logout successfully");
      navigate('/portal/login');
    }   
    const handleResume = () => {
            navigate('/portal/application-form');
    }
    

    useEffect(() => {
          if(authError){
              setError(authError);
          }
          setAuthError(null);
        }, [authError]);

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

      {error && <Alert error={error} onClose={() => setError(null)} />}

    <div className='application-cards'>
      {dataLoading||authLoading?<LoadingComponent/>:
        applicationData?
          <ApplicationCard
          appNumber={applicationData?applicationData.application_id:"Loading"}
          candidateName={applicationData?applicationData.name:"Deepanshu Kaushik"}
          program={applicationData?applicationData.program:"AURUM Banker Program"}
          status={applicationData?applicationData.status:"Started"}
          onResume={handleResume}  
        />:   <ApplicationCard
        appNumber={applicationData?applicationData.application_id:"NA"}
        candidateName={applicationData?applicationData.name:"Not found"}
        program={applicationData?applicationData.program:"AURUM Banker Program"}
        status={applicationData?applicationData.status:"Error"}
        
        />
        }
  
      </div>
        </>
    );
}

export default PortalDashboardPage;