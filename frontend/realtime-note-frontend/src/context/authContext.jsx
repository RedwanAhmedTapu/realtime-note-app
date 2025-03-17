"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const SERVER_URL = "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/login`, { email, password }, { withCredentials: true });
      setAccessToken(res.data.accessToken);
      setUser(res.data);
      return res;
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
      throw error; // Re-throw the error for handling in the component
    }
  };

  // Refresh Access Token
  const refreshAccessToken = async () => {
    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/refresh`, {}, { withCredentials: true });
      setAccessToken(res.data.accessToken);
      setUser(res.data);
      console.log("Refreshed Access Token:", res.data.accessToken); // Debugging log
    } catch (error) {
      console.error("Failed to refresh token:", error.response?.data?.message);
      setAccessToken(null); // Clear the access token if refresh fails
      setUser(null);
    }
  };

  // Automatically refresh the access token on mount
  useEffect(() => {
    refreshAccessToken();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Logout
  const logout = async () => {
    try {
      await axios.post(`${SERVER_URL}/api/auth/logout`, {}, { withCredentials: true });
      setAccessToken(null);
      setUser(null);
      window.location.href = "/login";

    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;