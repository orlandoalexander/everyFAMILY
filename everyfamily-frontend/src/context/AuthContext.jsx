import { createContext, useState, useEffect } from "react";

//Here we create a global sign in state which is stored locally so will remain upon page refresh.

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storeduser = JSON.parse(localStorage.getItem("user"));
    if (storeduser) {
      setUser(storeduser);
    }
  }, []);

  const login = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
