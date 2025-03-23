import { useState, useContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./components/Dashboard/index.jsx";
import Resources from "./components/Resources/index.jsx";
import Login from "./components/Login/index.jsx";
import AddResourceModal from "./components/Resources/AddResourceModal.jsx";
import ManageUsersModal from "./components/Dashboard/ManageUsersModal.jsx";
import useAddResource from "./hooks/useAddResource.js";
import logo from "./assets/everyFAMILY-logo.png";
import AuthContext from "./AuthContext.jsx";
import { Input, Button, Dropdown, Form, message } from "antd";
import { Plus, Key, Menu as MenuIcon, Users, LogOut } from "react-feather";
import "@ant-design/v5-patch-for-react-19";
import "./App.css";

const { Search } = Input;

const usersInfo = [
  { key: "1", name: "user", email: "user@gmail.com", action: "Remove User" },
  { key: "2", name: "user", email: "user@gmail.com", action: "Remove User" },
  { key: "3", name: "user", email: "user@gmail.com", action: "Remove User" },
  { key: "4", name: "user", email: "user@gmail.com", action: "Remove User" },
  { key: "5", name: "user", email: "user@gmail.com", action: "Remove User" },
];

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [manageUsersOpen, setManageUsersOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const addResource = useAddResource();

  const showManageUsersModal = () => setManageUsersOpen(true);
  const handleManageUsersCancel = () => setManageUsersOpen(false);

  const showResourceModal = () => {
    setResourceModalOpen(true);
  };

  const handleResourceModalCancel = () => {
    setResourceModalOpen(false);
  };

  const handleResourceModalSubmit = (resourceData) => {
    addResource.mutate(resourceData, {
      onSuccess: () => {
        setResourceModalOpen(false);
        messageApi.success("Resource added successfully");
        console.log("Resource added successfully!");
      },
      onError: (err) => {
        console.error("Failed to add resource", err);
      },
    });
  };

  const menuItems = [
    user.role === "admin" && {
      key: "users",
      icon: <Users size={15} />,
      label: (
        <div type="text" onClick={showManageUsersModal}>
          Manage users
        </div>
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
                onClick={showResourceModal}
              >
                Add new
              </Button>
              <Dropdown
                menu={{ items: menuItems }}
                trigger={["hover"]}
                open={menuOpen}
                onOpenChange={setMenuOpen}
              >
                <MenuIcon
                  size={40}
                  color="black"
                  style={{ cursor: "pointer" }}
                />
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
      {contextHolder}
      <AddResourceModal
        open={resourceModalOpen}
        onCancel={handleResourceModalCancel}
        onSubmit={handleResourceModalSubmit}
        user={user}
      />
      <ManageUsersModal
        open={manageUsersOpen}
        onCancel={handleManageUsersCancel}
        usersInfo={usersInfo}
      />
    </div>
  );
}

export default App;
