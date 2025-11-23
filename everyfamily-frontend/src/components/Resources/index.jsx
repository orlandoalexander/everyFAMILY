import { useState } from 'react'
import { useLocation } from "react-router-dom";
import useGetCategories from "../../hooks/useGetCategories";
import useGetTypes from "../../hooks/useGetTypes";
import useGetResources from "../../hooks/useGetResources.js";
import ResourceCard from "./ResourceCard.jsx";
import { Row, Empty, Spin, Select, Breadcrumb } from "antd";
import { Home } from 'react-feather'
import "./index.css";

const { Option } = Select;

function Resources({ setResourceModalOpen, setResourceModalData }) {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const resourceType = queryParams.get("type");
  const resourceCategory = queryParams.get("category");
  const searchQuery = queryParams.get("search") || "";
  const resourceFilter = queryParams.get("filter");

  const { data: categoryData } = useGetCategories();
  const { data: typeData } = useGetTypes();

  const [selectedCategories, setSelectedCategories] = useState(
    resourceCategory ? [resourceCategory] : []
  );
  const [selectedTypes, setSelectedTypes] = useState(resourceType ? [resourceType] : []);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const { data, isLoading, isFetching } = useGetResources();

  const filteredResources = data?.filter((resource) => {
    const matchesType =
      selectedTypes.length > 0
        ? selectedTypes.some(type =>
          resource.type_title?.toLowerCase() === type.toLowerCase()
        )
        : true;

    const matchesCategory =
      selectedCategories.length > 0
        ? selectedCategories.some(cat =>
          resource.category_title?.toLowerCase() === cat.toLowerCase()
        )
        : true;

    const matchesSearch = searchQuery
      ? resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const resourcesTitle = resourceFilter
    ? `${resourceFilter.charAt(0).toUpperCase() + resourceFilter.slice(1)}${resourceFilter === "recent" ? "ly added" : ""} resources`
    : resourceCategory || resourceType
      ? `Filtered resources` :
      "All resources";

  return (
    <div className="resources-container">
      <Breadcrumb
        style={{ marginBottom: '1rem' }}
        items={[
          { title: 'Home', href: '/' },
          { title: resourcesTitle }
        ]}
      />
      <div className='resources-header'>
        <h2 style={{ color: "black", marginBottom: '0px' }}>
          {resourcesTitle}
        </h2>

        <div className='resources-filter-container'>
          <div>
            <p style={{ marginBottom: '5px' }}>Categories</p>
            <Select
              mode="multiple"
              size='small'
              placeholder="Select categories"
              value={selectedCategories}
              onChange={(values) => setSelectedCategories(values)}
              style={{ width: 250 }}
            >
              {categoryData &&
                categoryData.map((item, index) => (
                  <Select.Option key={index} value={item.title}>
                    {item.title}
                  </Select.Option>
                ))}
            </Select>
          </div>
          <div>
            <p style={{ marginBottom: '5px' }}>Media type</p>
            <Select
              mode="multiple"
              size='small'
              placeholder="Select media type"
              value={selectedTypes}
              onChange={(values) => setSelectedTypes(values)}
              style={{ width: 250 }}
            >
              {typeData &&
                typeData.map((item, index) => (
                  <Select.Option key={index} value={item.title}>
                    {item.title}
                  </Select.Option>
                ))}
            </Select>
          </div>
        </div>

      </div>

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
                style={{ position: "absolute", top: "45%", left: "45%" }}
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
                  setResourceModalOpen={setResourceModalOpen}
                  setResourceModalData={setResourceModalData}
                />
              ))
            ))}
        </Row>
      )}
    </div>
  );
}

export default Resources;
