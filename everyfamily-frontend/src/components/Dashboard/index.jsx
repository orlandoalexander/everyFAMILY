import { useState } from "react";
import "./index.css";
import ResourceCard from "./ResourceCard";
import AddResourceModal from "./AddResourceModal";
import logo from "../../assets/everyFAMILY-logo.png";
import feature1 from "../../assets/everyFAMILY-feature1.png";
import { Input, Button } from "antd";
import Category from "./Category.jsx";
import { Plus } from "react-feather";

const { Search } = Input;

const allResources = [
  { title: "A", description: "a", category: "All resources" },
  { title: "B", description: "b", category: "All resources" },
  { title: "C", description: "c", category: "Arrest" },
  { title: "D", description: "d", category: "Court" },
];
const allCategories = ["All resources", "Arrest", "Court", "Imprisonment"];

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);

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
        <Button
          className="dashboard-header-button"
          type="primary"
          icon={<Plus />}
          size="large"
          onClick={showModal}
        >
          Add new
        </Button>
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
          <h2>Featured</h2>
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
              .map(({ title, description }, i) => (
                <ResourceCard key={i} title={title} description={description} />
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
