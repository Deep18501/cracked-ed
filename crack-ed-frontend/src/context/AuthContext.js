import React, { createContext, useState, useEffect } from "react";
import { loginUser,registerUser,logoutUser,sendLoginUserOtp,sendRegisterUserOtp,sendCallbackDetailAPI } from '../controllers/authController';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);
  // const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    const token = localStorage.getItem("TOKEN");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false); // ✅ Done checking
  }, []);
  
  useEffect(() => {
    // Check for token in local storage
    const token = localStorage.getItem("TOKEN");
    console.log(token);
    if(token!==null){
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [isAuthenticated]);


  const login = async (phone, otp) => {
    setLoading(true);
    try {
      const response = await loginUser(phone, otp); 
      setIsAuthenticated(true); 
      setLoading(false);
      return response;
    } catch (error){
      setLoading(false);
      throw error; 
    }
  };
  const sendLoginOtp = async (phone) => {
    setLoading(true);
    try {
      const response = await sendLoginUserOtp(phone); 
      setLoading(false);
      return response;
    } catch (error){
      setLoading(false);
      throw error; 
    }
  };

  const logout = () => {
    logoutUser();
    setIsAuthenticated(false);
  };  



  const register = async (name,email,mobile,otp) => {
    const resp=await registerUser(name,email,mobile,otp);
    return resp;
  }; 
  
  const sendRegisterOtp = async (name,email,mobile) => {
    const resp=await sendRegisterUserOtp(name,email,mobile);
    return resp;
  }; 
  
  const sendCallbackDetails = async (first_name,last_name,email,phone) => {
    const resp=await sendCallbackDetailAPI(first_name,last_name,email,phone);
    return resp;
  };
  // if (loading) {
  //   return <div>Loading...</div>;  // Show a loading indicator until auth status is determined
  // }

  return (
    <AuthContext.Provider value={{ isAuthenticated,loading,login,logout,register,sendLoginOtp,sendRegisterOtp,sendCallbackDetails }}>
      {children}
    </AuthContext.Provider>
  );
};
