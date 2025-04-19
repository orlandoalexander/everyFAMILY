import { useLocation } from "react-router-dom";
import useGetResources from "../../hooks/useGetResources.js";
import ResourceCard from "./ResourceCard.jsx";
import { Row, Empty, Spin } from "antd";
import "./index.css";

function Resources() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const resourceType = queryParams.get("type");
  const resourceCategory = queryParams.get("category");
  const searchQuery = queryParams.get("search") || "";
  const resourceFilter = queryParams.get("filter");

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const { data, isLoading, isFetching } = useGetResources();

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
        resource.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        resource.category_title.toLowerCase() === searchQuery.toLowerCase()
      : true;

    const matchesFilter =
      resourceFilter === "recent"
        ? new Date(resource.created_at) >= oneMonthAgo
        : resourceFilter === "featured"
        ? resource.featured === true
        : resourceFilter === "saved"
        ? resource.saved === true
        : true;

    return matchesType && matchesCategory && matchesSearch && matchesFilter;
  });

  if (resourceFilter === "recent" && filteredResources) {
    filteredResources.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }

  return (
    <div className="resources-container">
      <h2 style={{ color: "black" }}>
        {resourceFilter
          ? `${
              resourceFilter.charAt(0).toUpperCase() +
              resourceFilter.slice(1) +
              (resourceFilter === "recent" ? "ly added" : "")
            }  resources`
          : resourceCategory
          ? `All '${resourceCategory}' resources`
          : "Resources"}
      </h2>
      {isLoading || isFetching ? (
        <Spin
          size="large"
          style={{ position: "absolute", top: "50%", left: "50%" }}
        />
      ) : (
        <Row gutter={[20, 20]} align="middle">
          {filteredResources &&
            (filteredResources.length === 0 ? (
              <Empty
                description="No resources found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ position: "absolute", top: "50%", left: "50%" }}
              />
            ) : (
              filteredResources.map((resource, index) => (
                <ResourceCard
                  key={index}
                  id={resource.id}
                  title={resource.title}
                  link={resource.link}
                  description={resource.description}
                  type={resource.type_title}
                  thumbnail_url={resource.thumbnail_url}
                  category={resource.category_title}
                  saved={resource.saved}
                  featured={resource.featured}
                />
              ))
            ))}
        </Row>
      )}
    </div>
  );
}

export default Resources;
