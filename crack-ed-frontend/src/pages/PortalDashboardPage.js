import React, { useState, useEffect, useContext } from 'react';
import PortalHeader from "../components/PortalHeader.js";
import '../styles/portal.css';
import CustomTextField from '../utils/custom_textfield.js';
import OtpInput from '../utils/otp_input.js';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext.js";
import { DataContext } from "../context/DataContext.js";
import ApplicationCard from '../components/ApplicationCard.js';
import { LoadingComponent } from '../components/LoadingComponent.js';
import Alert from '../components/Alert.js';


const PortalDashboardPage = () => {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const dataContext = useContext(AuthContext);
  const { getApplicationData, applicationData, dataLoading } = useContext(DataContext);  // Correctly access getApplicationData from DataContext
  const { authLoading, authError, setAuthError } = useContext(AuthContext);  // Correctly access getApplicationData from DataContext
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
    if (authError) {
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
    console.log("State Sent ", location.state);
    if (location.state?.fromRegister) {
      setError({ "type": "success", "message": "Register Successfully" });
          window.history.replaceState({}, document.title);
    }
    if (location.state?.fromLogin) {
      setError({ "type": "success", "message": "Login Successfully" });
          window.history.replaceState({}, document.title);
    }
    getApplicationData();
  }, []);

  useEffect(() => {
    console.log("Application Data dash:", applicationData);
  }, [applicationData]);

  return (
    <>
      <PortalHeader >
        <nav className="nav-links">
          <a href="/portal" className="nav-link">Home</a>
          <a href="/portal/dashboard" className="nav-link">Dashboard</a>
        </nav>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </PortalHeader>

      {error && <Alert error={error} onClose={() => setError(null)} />}

      <div className='application-cards'>
        {dataLoading || authLoading ? <LoadingComponent /> :
          applicationData ?
            <ApplicationCard
              appNumber={applicationData ? applicationData.application_id : "Loading"}
              candidateName={applicationData ? applicationData.name : "Deepanshu Kaushik"}
              program={applicationData ? applicationData.program : "AURUM Banker Program"}
              status={applicationData ? applicationData.status == "Apply Now" ? "Apply Now" : applicationData.status : ""}
              onResume={handleResume}
            /> : <ApplicationCard
              appNumber={applicationData ? applicationData.application_id : "NA"}
              candidateName={applicationData ? applicationData.name : "Not found"}
              program={applicationData ? applicationData.program : "AURUM Banker Program"}
              status={applicationData ? applicationData.status : "Error"}
            />
        }

      </div>
    </>
  );
}

export default PortalDashboardPage;