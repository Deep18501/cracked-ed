import React, { createContext, useState, useEffect,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { get_application_data_api , update_application_data_api } from "../controllers/dataController";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
   const [applicationData, setApplicationData] = useState(null);
   const [dataLoading, setDataLoading] = useState(false);
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [dataError, setDataError] = useState(null);
  
    const getApplicationData = async () => {
      setDataLoading(true);
      try {
        let resp = await get_application_data_api();
        console.log("Application Data:", resp);
        setApplicationData(resp);
        console.log("Application Data:", applicationData);
      } catch (err) {
        setDataError({"type":"error","message":"Error Fetching Data"}); // Set the success state
        console.error("Error fetching application data:", err);
      }
      setDataLoading(false);
    }
  

    const updateApplicationData = async (data) => {
      setDataLoading(true);
      try {
        let resp = await update_application_data_api(data);
        console.log("Application Data:", resp);
        setApplicationData(resp);
        console.log("Application Data:", applicationData);
      } catch (err) {
        setDataError({"type":"error","message":"Error Fetching Data"}); // Set the success state
        console.error("Error fetching application data:", err);
      }
      setDataLoading(false);
      }
  
    return (
      <DataContext.Provider value={{applicationData, getApplicationData,setApplicationData,updateApplicationData,dataLoading, dataError, setDataError }}>
        {children}
      </DataContext.Provider>
    );
  }