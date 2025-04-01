import { useState, useContext, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard/index";
import Resources from "./components/Resources/index";
import CreateAccount from "./components/Auth/CreateAccount";
import Login from "./components/Auth/Login";
import UserProfileSetup from "./components/Auth/UserProfileSetup";
import AddResourceModal from "./components/Resources/AddResourceModal";
import ManageUsersModal from "./components/Dashboard/ManageUsersModal";
import ReferralCodesModal from "./components/Dashboard/ReferralCodesModal.jsx";
import ChangePasswordModal from "./components/Auth/ChangePasswordModal";
import useAddResource from "./hooks/useAddResource";
import logo from "./assets/everyFAMILY-logo.png";
import AuthContext from "./AuthContext";
import { Input, Button, Dropdown, message } from "antd";
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
import useGetUsers from "./hooks/useGetUsers";
import useGetReferralCodes from "./hooks/useGetReferralCodes";

const { Search } = Input;

function App() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [manageUsersOpen, setManageUsersOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchText, setSearchText] = useState("");
  const [referralCodesOpen, setReferralCodesOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const addResource = useAddResource();
  const { data: users, isLoading, error } = useGetUsers();
  const { data: referralCodes } = useGetReferralCodes();

  const showManageUsersModal = () => setManageUsersOpen(true);
  const handleManageUsersCancel = () => setManageUsersOpen(false);

  const showReferralCodesModal = () => setReferralCodesOpen(true);
  const handleReferralCodesCancel = () => setReferralCodesOpen(false);

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
      label: (
        <div onClick={() => setChangePasswordOpen(true)}>Change password</div>
      ),
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

  const isSimpleHeaderPage =
    location.pathname === "/login" ||
    location.pathname === "/create_account" ||
    location.pathname === "/complete_profile";

  return (
    <div className="app">
      <header className="dashboard-header">
        <img src={logo} alt="everyFAMILY logo" onClick={() => navigate("/")} />

        {!isSimpleHeaderPage && (
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
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create_account" element={<CreateAccount />} />
        <Route path="/complete_profile" element={<UserProfileSetup />} />
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
        usersInfo={users || []}
      />
      <ReferralCodesModal
        open={referralCodesOpen}
        onCancel={handleReferralCodesCancel}
        referralCodes={referralCodes}
      />
      <ChangePasswordModal
        open={changePasswordOpen}
        onCancel={() => setChangePasswordOpen(false)}
      />
    </div>
  );
}

export default App;
