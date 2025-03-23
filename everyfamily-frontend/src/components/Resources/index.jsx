import { Row } from "antd";
import useGetResources from "../../hooks/useGetResources.js";
import ResourceCard from "./ResourceCard.jsx";
import "./index.css";

function Resources({ resourceType }) {
  const { data, isLoading, isError } = useGetResources();

  return (
    <div className="resources-container">
      <h2>All resources</h2>
      <Row gutter={[20, 20]} align="middle">
        {data &&
          data.map((resource, index) => (
            <ResourceCard
              key={index}
              title={resource.title}
              link={resource.link}
              description={resource.description}
              type={resource.type_title}
            />
          ))}
      </Row>
    </div>
  );
}

export default Resources;
