import React, { createContext, useState, useEffect,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { get_application_data_api , update_application_data_api } from "../controllers/dataController";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
   const [applicationData, setApplicationData] = useState(null);
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
  
    const getApplicationData = async () => {
      try {
        let resp = await get_application_data_api();
        console.log("Application Data:", resp);
        setApplicationData(resp);
        console.log("Application Data:", applicationData);
      } catch (err) {
        console.error("Error fetching application data:", err);

      }
    }
  

    const updateApplicationData = async (data) => {
      try {
        let resp = await update_application_data_api(data);
        console.log("Application Data:", resp);
        setApplicationData(resp);
        console.log("Application Data:", applicationData);
      } catch (err) {
        console.error("Error fetching application data:", err);
      }
      }
  
    return (
      <DataContext.Provider value={{applicationData, getApplicationData,setApplicationData,updateApplicationData }}>
        {children}
      </DataContext.Provider>
    );
  }