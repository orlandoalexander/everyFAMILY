import { useState, useContext, useEffect, useRef } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "./components/Dashboard/index";
import Resources from "./components/Resources/index";
import CreateAccount from "./components/Auth/CreateAccount";
import Login from "./components/Auth/Login";
import UserProfile from "./components/Auth/UserProfile.jsx";
import ResourceModal from "./components/Resources/ResourceModal.jsx";
import ManageUsersModal from "./components/Dashboard/ManageUsersModal";
import UserDetailsModal from "./components/Dashboard/UserDetailsModal";
import ManageReferralsModal from "./components/Dashboard/ManageReferralsModal.jsx";
import ChangePasswordModal from "./components/Dashboard/ChangePasswordModal.jsx";
import useResetDemoDb from "./hooks/useResetDemoDb";
import logo from "./assets/everyFAMILY-logo.png";
import AuthContext from "./AuthContext";
import { Input, Button, Dropdown, Result, notification } from "antd";
import {
  Plus,
  Key,
  Menu as MenuIcon,
  Users,
  User,
  LogOut,
  Hash,
  RefreshCcw,
} from "react-feather";
import "@ant-design/v5-patch-for-react-19";
import "./App.css";

const isDemo = import.meta.env.VITE_DEMO;

const { Search } = Input;

function App() {
  const demoNotificationShown = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [manageUsersOpen, setManageUsersOpen] = useState(false);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [referralCodesOpen, setReferralCodesOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [resourceModalData, setResourceModalData] = useState({});

  const { user, logout, isLoggedIn } = useContext(AuthContext);

  const { mutate: resetDemo, isLoading } = useResetDemoDb();

  const location = useLocation();
  const navigate = useNavigate();

  const showChangePasswordModal = () => setChangePasswordOpen(true);
  const hideChangePasswordModal = () => setChangePasswordOpen(false);

  const showManageUsersModal = () => setManageUsersOpen(true);
  const hideManageUsersModal = () => setManageUsersOpen(false);

  const showUserDetailsModal = () => setUserDetailsOpen(true);
  const hideUserDetailsModal = () => setUserDetailsOpen(false);

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
    if (
      !demoNotificationShown.current &&
      import.meta.env.VITE_DEMO === "true"
    ) {
      notification.warning({
        message: "Demo Mode",
        description: "You are in demo mode. Some actions are disabled.",
        duration: 0,
        placement: "topRight",
      });
      demoNotificationShown.current = true;
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get("search");
    if (search) {
      setSearchText(search);
    }
  }, [location]);

  const menuItems = [
    {
      key: "user",
      icon: <User size={15} />,
      label: <div onClick={showUserDetailsModal}>Your account</div>,
    },
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
          style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            pointerEvents: "auto",
            cursor: "pointer",
          }}
          draggable={false}
        />

        {showHeader && (
          <>
            <Search
              className="dashboard-header-search"
              placeholder="Find resources by name, description, type or category"
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
                {isDemo === "true" ? (
                  <Button
                    loading={isLoading}
                    onClick={() => resetDemo()}
                    size="large"
                    icon={<RefreshCcw size={14} />}
                    style={{ marginLeft: "-20px" }}
                  >
                    Reset Demo
                  </Button>
                ) : (
                  <Dropdown
                    menu={{ items: menuItems }}
                    trigger={["hover"]}
                    open={menuOpen}
                    onOpenChange={setMenuOpen}
                  >
                    <MenuIcon size={40} className="menu" />
                  </Dropdown>
                )}
              </div>
            ) : (
              <div className="dashboard-header-buttons">
                <Dropdown
                  menu={{ items: menuItems }}
                  trigger={["hover"]}
                  open={menuOpen}
                  onOpenChange={setMenuOpen}
                >
                  <MenuIcon size={40} className="menu" />
                </Dropdown>
              </div>
            )}
          </>
        )}
      </header>

      <Routes>
        <Route
          path="/login"
          element={isDemo ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/create_account"
          element={isDemo ? <Navigate to="/" replace /> : <CreateAccount />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard
                setResourceModalOpen={setResourceModalOpen}
                setResourceModalData={setResourceModalData}
              />
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
              <Resources
                setResourceModalOpen={setResourceModalOpen}
                setResourceModalData={setResourceModalData}
              />
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
        id={resourceModalData.id}
        resourceData={resourceModalData}
      />
      <ManageUsersModal
        open={manageUsersOpen}
        onCancel={hideManageUsersModal}
        user={user}
      />
      <UserDetailsModal
        open={userDetailsOpen}
        onCancel={hideUserDetailsModal}
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

      <footer className="footer-credit">
        © {new Date().getFullYear()} everyFAMILY. Website by 180DC Bristol —
        Orlando Alexander, Oliver Flowerdew, Karena Ho, Sahithi Sesham & Sarthak
        Kasturi.
      </footer>
    </div>
  );
}

export default App;
