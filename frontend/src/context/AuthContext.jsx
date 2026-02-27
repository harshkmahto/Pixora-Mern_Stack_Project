import { createContext, useContext, useEffect, useState } from "react";
import apiRequest from "../utils/apiRequest";
import SummaryApi from "../common";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Check auth on app load
  const checkAuth = async () => {
    try {
      const res = await apiRequest(SummaryApi.auth.getProfile);
      setUser(res.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // 🚪 Logout
  const logout = async () => {
    try {
      await apiRequest(SummaryApi.auth.logout);
      setUser(null);
    } catch (error) {
      console.log(error.message);
    }
  };

  // 👑 Role Check
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);