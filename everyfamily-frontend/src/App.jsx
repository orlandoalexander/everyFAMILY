import { useState, useContext, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "./components/Dashboard/index";
import Resources from "./components/Resources/index";
import CreateAccount from "./components/Auth/CreateAccount";
import Login from "./components/Auth/Login";
import UserProfile from "./components/Auth/UserProfile.jsx";
import ResourceModal from "./components/Resources/ResourceModal.jsx";
import ManageUsersModal from "./components/Dashboard/ManageUsersModal";
import ManageReferralsModal from "./components/Dashboard/ManageReferralsModal.jsx";
import ChangePasswordModal from "./components/Dashboard/ChangePasswordModal.jsx";
import logo from "./assets/everyFAMILY-logo.png";
import AuthContext from "./AuthContext";
import { Input, Button, Dropdown, Result } from "antd";
import {
  Plus,
  Key,
  Menu as MenuIcon,
  Users,
  LogOut,
  Hash,
} from "react-feather";
import "@ant-design/v5-patch-for-react-19";
import "./App.css";

const { Search } = Input;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [manageUsersOpen, setManageUsersOpen] = useState(false);
  const [referralCodesOpen, setReferralCodesOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const { user, logout, isLoggedIn } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const showChangePasswordModal = () => setChangePasswordOpen(true);
  const hideChangePasswordModal = () => setChangePasswordOpen(false);

  const showManageUsersModal = () => setManageUsersOpen(true);
  const hideManageUsersModal = () => setManageUsersOpen(false);

  const showReferralCodesModal = () => setReferralCodesOpen(true);
  const hideReferralCodesModal = () => setReferralCodesOpen(false);

  const showResourceModal = () => setResourceModalOpen(true);
  const hideResourceModal = () => setResourceModalOpen(false);

  const handleSearch = (value) => {
    if (value === "") return;
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("search", value);
    navigate(`/resources?${searchParams.toString()}`);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get("search");
    if (search) {
      setSearchText(search);
    }
  }, [location]);

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
    user.role === "admin" && {
      key: "referral codes",
      icon: <Hash size={15} />,
      label: (
        <div type="text" onClick={showReferralCodesModal}>
          Referral codes
        </div>
      ),
    },
    {
      key: "password",
      icon: <Key size={15} />,
      label: <div onClick={showChangePasswordModal}>Change password</div>,
    },
    {
      key: "logout",
      icon: <LogOut size={15} />,
      label: (
        <div
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </div>
      ),
    },
  ];

  const showHeader =
    location.pathname === "/" || location.pathname === "/resources";

  return (
    <div className="app">
      <header className="dashboard-header">
        <img
          src={logo}
          alt="everyFAMILY logo"
          onClick={() => {
            navigate("/");
            setSearchText("");
          }}
        />

        {showHeader && (
          <>
            <Search
              className="dashboard-header-search"
              placeholder="Find resources by name, description etc."
              allowClear
              size="large"
              value={searchText}
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
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
          </>
        )}
      </header>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/create_account" element={<CreateAccount />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user_profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resources/:resourceType?"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Result
              status="404"
              title="404"
              subTitle="Sorry, the page you visited does not exist."
              extra={
                <Button type="primary" href={isLoggedIn ? "/" : "/login"}>
                  {isLoggedIn ? "Go home" : "Go to login"}
                </Button>
              }
            />
          }
        />
      </Routes>
      <ResourceModal
        open={resourceModalOpen}
        onCancel={hideResourceModal}
        user={user}
      />
      <ManageUsersModal
        open={manageUsersOpen}
        onCancel={hideManageUsersModal}
        user={user}
      />
      <ManageReferralsModal
        open={referralCodesOpen}
        onCancel={hideReferralCodesModal}
      />
      <ChangePasswordModal
        open={changePasswordOpen}
        onCancel={hideChangePasswordModal}
      />
    </div>
  );
}

export default App;
