import React, { useState, useContext,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/portal_header.css';
import logo from '../assets/logo.webp';
import asfbank from '../assets/asfbank_icon.png';
import portalHeader from '../assets/portal_header_icon.png';
import { AuthContext } from "../context/AuthContext";
import { DataContext } from "../context/DataContext";
import Alert from './Alert.js';

const PortalHeader = ({children}) => {
  const navigate = useNavigate();
    const [error, setError] = useState(null);
    const { authLoading,authError,setAuthError } = useContext(AuthContext);  // Correctly access getApplicationData from DataContext
    const dataCtx = useContext(DataContext);
    const dataError =  dataCtx?dataCtx.dataError:null;
    useEffect(() => {
        if(authError){
            setError(authError);
        }
        setAuthError(null);
      }, [authError]);

 useEffect(() => {
      if(dataCtx){
        if(dataError){
            setError(dataError);
        }
        dataCtx.setDataError(null);
      }
      }, [dataError]);




  return (
    <>
    <div className="header-container">
      <img src={portalHeader} alt="Portal Header" className="header-icon-img" />
    <div className="header-content">
  
    <div className="header-left">
      <img src={asfbank} alt="AU Bank" className="logo" />
      <img src={logo} alt="Crack-ED" className="logo" />
    </div>
    
    <div className="header-right">
      {children}
    </div>
        
    </div>
  </div>
  {error && <Alert error={error} onClose={() => setError(null)} />}

  </>
  );


};

const LinkItem = ({ title, link, dropdown, children }) => {
  return (
    <li className={dropdown ? "nav-item dropdown" : "nav-item"}>
      <div className="nav-link-row">
      <Link to={link} className="nav-link">{title}</Link>
      {dropdown ? (
             <span class="sub-arrow"><svg class="e-font-icon-svg e-fas-angle-down" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg></span>
      ):null}
      </div>
      <div className="header-underline" />
      {dropdown && (
        <ul className="dropdown-menu">
          {children}
        </ul>
      )}
    </li>
  );
};
export default PortalHeader;
