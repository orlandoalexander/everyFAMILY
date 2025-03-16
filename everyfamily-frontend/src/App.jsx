import { useContext } from "react";
import Dashboard from "./components/Dashboard/index.jsx";
import { AuthContext } from "./AuthContext";
import "./App.css";

export default function App() {
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <div className="app">
      <Dashboard />
    </div>
  );
}
