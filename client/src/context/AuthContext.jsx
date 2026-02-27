import { createContext, useContext, useEffect, useMemo, useState } from "react";
import API from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Attach token to all requests
  useEffect(() => {
    if (token) {
      API.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete API.defaults.headers.common.Authorization;
      localStorage.removeItem("token");
    }
  }, [token]);

  // Try to restore user (simple approach: store user in localStorage)
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
    setReady(true);
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  };

  const register = async (data) => {
    await API.post("/auth/register", data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = useMemo(
    () => ({ user, token, ready, login, register, logout }),
    [user, token, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);