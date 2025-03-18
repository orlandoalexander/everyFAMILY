import { useState, useContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./components/Dashboard/index";
import Resources from "./components/Resources/index";
import Login from "./components/Login/index";
import AddResourceModal from "./components/Resources/AddResourceModal";
import ManageUsersModal from "./components/Dashboard/ManageUsersModal.jsx";
import logo from "./assets/everyFAMILY-logo.png";
import { AuthContext } from "./AuthContext";
import { Input, Button, Dropdown } from "antd";
import { Plus, Key, Menu as MenuIcon, Users, LogOut } from "react-feather";
import "./App.css";

const { Search } = Input;

export default function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [manageUsersOpen, setManageUsersOpen] = useState(false);

  const showManageUsersModal = () => setManageUsersOpen(true);
  const handleManageUsersCancel = () => setManageUsersOpen(false);

  const menuItems = [
    user.role === "admin" && {
      key: "users",
      icon: <Users size={15} />,
      label: (
        <Button type="text" onClick={showManageUsersModal}>
          Manage users
        </Button>
      ),
    },
    {
      key: "password",
      icon: <Key size={15} />,
      label: "Reset password",
    },
    {
      key: "logout",
      icon: <LogOut size={15} />,
      label: "Logout",
    },
  ];
  const usersInfo = [
    { key: "1", name: "user", email: "user@gmail.com", action: "Remove User" },
    { key: "2", name: "user", email: "user@gmail.com", action: "Remove User" },
    { key: "3", name: "user", email: "user@gmail.com", action: "Remove User" },
    { key: "4", name: "user", email: "user@gmail.com", action: "Remove User" },
    { key: "5", name: "user", email: "user@gmail.com", action: "Remove User" },
  ];
  const showModal = () => {
    setModalOpen(true);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
  };

  const handleModalSubmit = (resourceData) => {
    console.log("Resource Added: ", resourceData);
    setModalOpen(false);
  };

  return (
    <div className="app">
      {location.pathname !== "/login" && (
        <header className="dashboard-header">
          <img className="dashboard-header" src={logo} alt="everyFAMILY logo" />
          <Search
            className="dashboard-header-search"
            placeholder="Find resources by name, description etc."
            allowClear
            size="large"
          />
          {user.role === "admin" ? (
            <div className="dashboard-header-buttons">
              <Button
                className="dashboard-header-button"
                type="primary"
                icon={<Plus />}
                size="large"
                onClick={showModal}
              >
                Add new
              </Button>
              <Dropdown
                menu={{ items: menuItems }}
                trigger={["hover"]}
                open={menuOpen}
                onOpenChange={setMenuOpen}
              >
                <MenuIcon size={40} style={{ cursor: "pointer" }} />
              </Dropdown>
            </div>
          ) : (
            <div className="dashboard-header-buttons">
              <Dropdown
                menu={{ items: menuItems }}
                trigger={["hover"]}
                open={menuOpen}
                onOpenChange={setMenuOpen}
              >
                <MenuIcon size={40} style={{ cursor: "pointer" }} />
              </Dropdown>
            </div>
          )}
        </header>
      )}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resources/:resourceType?" element={<Resources />} />
      </Routes>
      <AddResourceModal
        open={modalOpen}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
      />
      <ManageUsersModal
        open={manageUsersOpen}
        onCancel={handleManageUsersCancel}
        usersInfo={usersInfo}
      />
    </div>
  );
}
