import { createContext, useContext, useState, useEffect } from "react";
import { users } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem("bestiario_auth_user");
    return s ? JSON.parse(s) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("bestiario_auth_user", JSON.stringify(user));
    else localStorage.removeItem("bestiario_auth_user");
  }, [user]);

  function login(email, password) {
    const res = users.login(email, password);
    setUser(res.user);
    // store token if needed
    localStorage.setItem("bestiario_token", res.token);
    return res;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("bestiario_token");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
