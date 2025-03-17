import "./index.css";
import ResourceCard from "../Resources/ResourceCard.jsx";
import feature1 from "../../assets/everyFAMILY-feature1.png";
import Category from "./Category.jsx";

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
  return (
    <div className="dashboard">
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
    </div>
  );
}

export default Dashboard;
