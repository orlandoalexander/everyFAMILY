import { useState, useContext } from "react";
import "./index.css";
import ResourceCard from "./ResourceCard";
import { AuthContext } from "../../AuthContext";
import AddResourceModal from "./AddResourceModal";
import logo from "../../assets/everyFAMILY-logo.png";
import feature1 from "../../assets/everyFAMILY-feature1.png";
import { Input, Button, Dropdown } from "antd";
import Category from "./Category.jsx";
import {
  Plus,
  Key,
  Menu as MenuIcon,
  Users,
  LogOut,
  Bookmark,
} from "react-feather";

const { Search } = Input;

const allResources = [
  { title: "A", description: "a", category: "All resources", type: "article" },
  { title: "B", description: "b", category: "All resources", type: "article" },
  { title: "B", description: "b", category: "All resources", type: "article" },
  { title: "B", description: "b", category: "All resources", type: "article" },
  { title: "B", description: "b", category: "All resources", type: "article" },
  { title: "B", description: "b", category: "All resources", type: "article" },
  { title: "B", description: "b", category: "All resources", type: "article" },
  { title: "B", description: "b", category: "All resources", type: "article" },
  { title: "C", description: "c", category: "Arrest", type: "video" },
  { title: "D", description: "d", category: "Court", type: "video" },
];
const allCategories = ["All resources", "Arrest", "Court", "Imprisonment"];

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    user.role === "admin" && {
      key: "users",
      icon: <Users size={15} />,
      label: "Manage users",
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
    <div className="dashboard">
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
      <section className="dashboard-featured">
        <div className="dashboard-featured-container">
          <img src={feature1} />
          <h2>Recently added</h2>
        </div>
        <div className="dashboard-featured-container">
          <img src={feature1} />
          <h2>Popular</h2>
        </div>
        <div className="dashboard-featured-container">
          <img src={feature1} />
          <h2>Saved</h2>
        </div>
      </section>
      <div className="dashboard-category">
        <h1>Browse by category</h1>
        {allCategories.map((label, index) => (
          <Category
            categoryKey={index}
            key={index}
            label={label}
            children={allResources
              .filter(({ category }) => category === label)
              .map(({ title, description, category, type }, i) => (
                <ResourceCard
                  key={i}
                  title={title}
                  description={description}
                  type={type}
                />
              ))}
          />
        ))}
      </div>
      <AddResourceModal
        open={modalOpen}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}

export default Dashboard;
