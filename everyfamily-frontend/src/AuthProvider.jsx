import { useState, useEffect } from "react";
import AuthContext from "./AuthContext.jsx";
import useGetUsers from "./hooks/useGetUsers";
import useUpdateUser from "./hooks/useUpdateUser.js";

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem("isLoggedIn") === "true"
  );
  const [user, setUser] = useState({
    role: sessionStorage.getItem("userRole"),
    id: parseInt(sessionStorage.getItem("userId")),
  });

  const { data: users } = useGetUsers(user.id);
  const updateUser = useUpdateUser();

  const login = ({ role, id, remember }) => {
    setIsLoggedIn(true);
    setUser({ role: role, id: id });
    if (remember) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", id);
      localStorage.setItem("userRole", role);
    }
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userId", id);
    sessionStorage.setItem("userRole", role);
  };

  const logout = () => {
    updateUser.mutate({ id: user.id, logged_in: false });
    setIsLoggedIn(false);
    setUser({ role: null, id: null });
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userRole");
  };

  useEffect(() => {
    if (
      users?.length > 0 &&
      users[0].id === user.id &&
      users[0].role !== user.role
    ) {
      sessionStorage.setItem("userRole", users[0].role);
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
