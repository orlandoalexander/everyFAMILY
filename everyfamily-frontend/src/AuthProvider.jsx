import { useState } from "react";
import AuthContext from "./AuthContext.jsx";

function AuthProvider({ children }) {
  localStorage.setItem("userId", 1);
  localStorage.setItem("userRole", "admin");
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );
  const [user, setUser] = useState({
    role: localStorage.getItem("userRole"),
    id: localStorage.getItem("userId"),
  });

  const login = ({ role, id, remember }) => {
    setIsLoggedIn(true);
    setUser({ role: role, id: id });
    if (remember) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", id);
      localStorage.setItem("userRole", role);
    } else localStorage.setItem("isLoggedIn", "false"); // clear local storage
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser({ role: null, id: null });
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
