import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 > Date.now()) {
            // Fetch full user data from profile endpoint
            const response = await axios.get(
              "http://localhost:30000/api/auth/profile",
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setUser(response.data);
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:30000/api/auth/login",
        {
          email,
          password,
        }
      );
      const { token, user: userData } = response.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (name, email, password, role = "user") => {
    try {
      const response = await axios.post(
        "http://localhost:30000/api/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );
      const { token, user: userData } = response.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:30000/api/auth/profile",
        updates,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Update failed",
      };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
