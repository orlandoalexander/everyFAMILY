import { useState, useEffect } from "react";
import AuthContext from "./AuthContext.jsx";
import useGetUsers from "./hooks/useGetUsers";
import useUpdateUser from "./hooks/useUpdateUser.js";

const isDemo = import.meta.env.VITE_DEMO;

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () =>
      sessionStorage.getItem("everyfamily_isLoggedIn") === "true" ||
      localStorage.getItem("everyfamily_isLoggedIn") === "true" ||
      isDemo === "true"
  );

  const [user, setUser] = useState({
    id: parseInt(
      isDemo
        ? "10"
        : sessionStorage.getItem("everyfamily_userId") ||
            localStorage.getItem("everyfamily_userId")
    ),
    role: isDemo
      ? "admin"
      : sessionStorage.getItem("everyfamily_userRole") ||
        localStorage.getItem("everyfamily_userRole"),
  });

  const { data: users } = useGetUsers(user.id);
  const updateUser = useUpdateUser();

  const login = ({ role, id, remember }) => {
    setIsLoggedIn(true);
    setUser({ role: role, id: id });
    if (remember) {
      localStorage.setItem("everyfamily_isLoggedIn", "true");
      localStorage.setItem("everyfamily_userId", id);
      localStorage.setItem("everyfamily_userRole", role);
    }
    sessionStorage.setItem("everyfamily_isLoggedIn", "true");
    sessionStorage.setItem("everyfamily_userId", id);
    sessionStorage.setItem("everyfamily_userRole", role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser({ role: null, id: null });
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    updateUser.mutate({ id: user.id, logged_in: false });
  };

  useEffect(() => {
    if (
      users?.length > 0 &&
      users.find((u) => u.id === user.id) &&
      users.find((u) => u.id === user.id).role !== user.role
    ) {
      sessionStorage.setItem("everyfamily_userRole", users[0].role);
      setUser((prevState) => ({ ...prevState, role: users[0].role }));
    }
  }, [users, user.id, user.role]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
