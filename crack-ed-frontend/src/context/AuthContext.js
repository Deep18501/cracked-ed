import React, { createContext, useState, useEffect } from "react";
import { loginUser,registerUser,logoutUser,sendLoginUserOtp,sendRegisterUserOtp,sendCallbackDetailAPI } from '../controllers/authController';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);
  // const [isStaff, setIsStaff] = useState(false);
  const [authLoading, setLoading] = useState(true);  // Loading state
  const [authError, setAuthError] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("TOKEN");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false); // ✅ Done checking
  }, []);
  
  useEffect(() => {
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
      setAuthError({"type":"success","message":"Login Successfully"}); // Set the success state
      return response;
    } catch (error){
      setLoading(false);
      setAuthError({"type":"error","message":"Error While Login"}); // Set the error state
    }
  };
  const sendLoginOtp = async (phone) => {
    setLoading(true);
    try {
      const response = await sendLoginUserOtp(phone); 
      setLoading(false);
      setAuthError({"type":"success","message":"Otp Sent Successfully"}); // Set the success state
      return response;
    } catch (error){
      setLoading(false);
      setAuthError({"type":"error","message":"Error While Sending Otp"}); // Set the error state
    }
  };

  const logout = () => {
    setLoading(true);
    logoutUser();
    setIsAuthenticated(false);
    setAuthError({"type":"success","message":"Logout Success"}); // Set the success state
    setLoading(false);
  };  



  const register = async (name,email,mobile,otp) => {
    setLoading(true);
    try{
      const resp=await registerUser(name,email,mobile,otp);
      setIsAuthenticated(true); 
      setLoading(false);
      setAuthError({"type":"success","message":"Register Successfully"}); // Set the success state
      return resp;
    }catch(error){
      setLoading(false);
      setAuthError({"type":"error","message":"Error in register"}); // Set the error state

      console.log("Error in register",error);
    }
    setLoading(false);

    
  }; 
  
  const sendRegisterOtp = async (name,email,mobile) => {

    setLoading(true);
    try{
      const resp=await sendRegisterUserOtp(name,email,mobile);
      setLoading(false);
      setAuthError({"type":"success","message":"OTP Sent Successfully"}); // Set the success state

      return resp;
    }catch(error){
      setLoading(false);
      setAuthError({"type":"error","message":"Error in sending Otp"}); // Set the error state

      console.log("Error in register otp",error);
    }
    setLoading(false);
  }; 
  
  const sendCallbackDetails = async (first_name,last_name,email,phone) => {
    setLoading(true);
    try{
      const resp=await sendCallbackDetailAPI(first_name,last_name,email,phone);
      setLoading(false);
      setAuthError({"type":"success","message":"We will get back to you soon"}); // Set the success state

      return resp;
    }catch(error){
      setLoading(false);
      setAuthError({"type":"error","message":"Error sending details"}); // Set the error state

      console.log("Error in callback details",error);
    }
    setLoading(false);
  };
  // if (loading) {
  //   return <div>Loading...</div>;  // Show a loading indicator until auth status is determined
  // }

  return (
    <AuthContext.Provider value={{ isAuthenticated,authLoading,login,logout,register,sendLoginOtp,sendRegisterOtp,sendCallbackDetails, authError, setAuthError}}>
      {children}
    </AuthContext.Provider>
  );
};
