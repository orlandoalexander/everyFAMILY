import "./index.css";
import { useNavigate } from "react-router-dom";
import ResourceCard from "../Resources/ResourceCard.jsx";
import useGetCategories from "../../hooks/useGetCategories.js";
import useGetResources from "../../hooks/useGetResources.js";
import feature1 from "../../assets/everyFAMILY-feature1.png";
import Category from "./Category.jsx";

function Dashboard() {
  const navigate = useNavigate();

  const {
    data: categoryData,
    isLoading: categoryIsLoading,
    isError: categoryIsError,
  } = useGetCategories();

  const {
    data: resourceData,
    isLoading: resourceIsLoading,
    isError: resourceIsError,
  } = useGetResources();

  return (
    <div className="dashboard">
      <section className="dashboard-featured">
        <div
          className="dashboard-featured-container"
          onClick={() => navigate("/resources?filter=recent")}
        >
          <img src={feature1} />
          <h2>Recently added</h2>
        </div>
        <div
          className="dashboard-featured-container"
          onClick={() => navigate("/resources?filter=featured")}
        >
          <img src={feature1} />
          <h2>Featured</h2>
        </div>
        <div
          className="dashboard-featured-container"
          onClick={() => navigate("/resources?filter=saved")}
        >
          <img src={feature1} />
          <h2>Saved</h2>
        </div>
      </section>
      {resourceData && (
        <div className="dashboard-category">
          <h1>Browse by category</h1>
          {categoryData &&
            categoryData.map((category, index) => (
              <Category
                key={index}
                categoryKey={index}
                label={
                  <div className="dashboard-category-title">
                    {category.title}
                    <span
                      onClick={() => {
                        navigate(`/resources?category=${category.title}`);
                      }}
                    >
                      View all
                    </span>
                  </div>
                }
                children={
                  resourceData &&
                  resourceData
                    .filter(({ category_id }) => category_id === category.id)
                    .map((resource, index) => (
                      <ResourceCard
                        key={index}
                        title={resource.title}
                        link={resource.link}
                        description={resource.description}
                        type={resource.type_title}
                        category={resource.category_title}
                        thumbnail_url={resource.thumbnail_url}
                      />
                    ))
                }
              />
            ))}

          <Category
            key="all"
            categoryKey="all"
            label={
              <div className="dashboard-category-title">
                All resources
                <span
                  onClick={() => {
                    navigate("/resources");
                  }}
                >
                  View all
                </span>
              </div>
            }
            children={resourceData.map((resource, index) => (
              <ResourceCard
                key={index}
                title={resource.title}
                link={resource.link}
                description={resource.description}
                type={resource.type_title}
                category={resource.category_title}
                thumbnail_url={resource.thumbnail_url}
              />
            ))}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
