"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
const SERVER_URL = "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setAccessToken(res.data.accessToken);
      setUser(res.data);
      return res;
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
      throw error;
    }
  };

  // Refresh Access Token
  const refreshAccessToken = async () => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/auth/refresh`,
        {},
        { withCredentials: true }
      );
      setAccessToken(res.data.accessToken);
      setUser(res.data);
    } catch (error) {
      console.error("Failed to refresh token:", error.response?.data?.message);
      setAccessToken(null);
      setUser(null);
      // Redirect to login if the error status is 401 or 403
      const errorMessage = error.response?.data?.message;
      if (
        (error.response?.status === 401 || error.response?.status === 403) &&
        errorMessage !== "No refresh token provided"
      ) {
        window.location.href = "/login";
      }
    }
  };

  // Automatically refresh the access token on mount
  useEffect(() => {
    if (!accessToken) {
      refreshAccessToken();
    } else {
      try {
        const decoded = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          refreshAccessToken();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        refreshAccessToken();
      }
    }
  }, [accessToken]);

  // Logout
  const logout = async () => {
    try {
      await axios.post(
        `${SERVER_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
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
