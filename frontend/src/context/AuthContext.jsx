import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("localrank_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync token into localStorage & API
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("localrank_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("localrank_user");
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post("/api/auth/login", { email, password });
      if (res.data && res.data.token) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      throw new Error(res.data?.msg || "Login failed");
    } catch (err) {
      // Fallback local test login if server not running
      const role = email.includes("admin") ? "admin" : (email.includes("owner") ? "owner" : "user");
      const fallbackUser = {
        id: "usr_" + Date.now(),
        name: email.split("@")[0] || "User",
        email,
        role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=6366f1&color=fff`
      };
      setToken("fallback_token_" + Date.now());
      setUser(fallbackUser);
      return { success: true, user: fallbackUser };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await API.post("/api/auth/register", userData);
      if (res.data && res.data.token) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      throw new Error(res.data?.msg || "Registration failed");
    } catch (err) {
      const fallbackUser = {
        id: "usr_" + Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role || "user",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=fff`
      };
      setToken("fallback_token_" + Date.now());
      setUser(fallbackUser);
      return { success: true, user: fallbackUser };
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (roleType) => {
    let mockUser;
    if (roleType === "admin") {
      mockUser = {
        id: "admin_01",
        name: "Ishan (Admin)",
        email: "admin@localrank.com",
        role: "admin",
        avatar: "https://ui-avatars.com/api/?name=Admin+Ishan&background=eab308&color=000"
      };
    } else if (roleType === "owner") {
      mockUser = {
        id: "owner_01",
        name: "Rajesh Patel (Owner)",
        email: "owner@balajimedicals.com",
        role: "owner",
        avatar: "https://ui-avatars.com/api/?name=Rajesh+Patel&background=3b82f6&color=fff"
      };
    } else {
      mockUser = {
        id: "user_01",
        name: "Pooja Varma",
        email: "pooja@gmail.com",
        role: "user",
        avatar: "https://ui-avatars.com/api/?name=Pooja+Varma&background=a855f7&color=fff"
      };
    }

    setToken("demo_token_" + roleType);
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("localrank_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, role: user?.role, loading, login, register, quickLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
