
import axios from "axios";

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});


// Add interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = "Bearer " + localStorage.getItem("TOKEN");
    return config;
  },
  (error) => Promise.reject(error)
);


export const get_application_data_api = async () => {
  try {
    console.log("getting data");
    const response = await axiosInstance.get("/dataset/get-application-data/");
    console.log("data received" + response.data);
    return response.data;
  } catch (error) {
    console.log("error - " + error.response.data.error);
    throw error.response.data.error || "Not Found";
  }
};
