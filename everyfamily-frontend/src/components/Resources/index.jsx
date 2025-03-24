import { Row } from "antd";
import { useLocation } from "react-router-dom"; // for URL parameters
import useGetResources from "../../hooks/useGetResources.js";
import ResourceCard from "./ResourceCard.jsx";
import "./index.css";

function Resources() {
  const { data, isLoading, isError } = useGetResources();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const resourceType = queryParams.get("type");
  const resourceCategory = queryParams.get("category");
  const searchQuery = queryParams.get("search") || "";

  const filteredResources = data?.filter((resource) => {
    const matchesType = resourceType
      ? resource.type_title.toLowerCase().includes(resourceType.toLowerCase())
      : true;
    const matchesCategory = resourceCategory
      ? resource.category_title
          .toLowerCase()
          .includes(resourceCategory.toLowerCase())
      : true;
    const matchesSearch = searchQuery
      ? resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesType && matchesCategory && matchesSearch;
  });

  return (
    <div className="resources-container">
      <h2>All resources</h2>
      <Row gutter={[20, 20]} align="middle">
        {filteredResources &&
          filteredResources.map((resource, index) => (
            <ResourceCard
              key={index}
              title={resource.title}
              link={resource.link}
              description={resource.description}
              type={resource.type_title}
              thumbnail_url={resource.thumbnail_url}
              category_title={resource.category_title}
            />
          ))}
      </Row>
    </div>
  );
}

export default Resources;
