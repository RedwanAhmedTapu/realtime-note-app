// axiosInstance.js
import axios from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const SERVER_URL = "http://localhost:5000";

const useAxios = () => {
  const { accessToken, logout } = useContext(AuthContext);

  // Create an axios instance with custom configuration
  const axiosInstance = axios.create({
    baseURL: SERVER_URL, // Ensure this matches your backend
    timeout: 10000, // Timeout after 10 seconds
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Ensures cookies like refresh tokens are sent
  });

  // Request Interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      console.log(accessToken)
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  // Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401 || status === 403) {
        console.warn("Unauthorized or Forbidden - Redirecting to login...");
        window.location.href = "/login"; 
      }
    }
    return Promise.reject(error);
  }
);

  return axiosInstance;
};

export default useAxios;
