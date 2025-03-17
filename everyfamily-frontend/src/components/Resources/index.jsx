import { Row } from "antd";
import ResourceCard from "./ResourceCard";
import "./index.css";

const resourceData = [
  {
    title: "Resource 1",
    description:
      "Description of resource 1 Description of resource 1 Description of resource 1 Description of resource 1",
    type: "video",
  },
  {
    title: "Resource 2",
    description: "Description of resource 2",
    type: "article",
  },
  {
    title: "Resource 3",
    description: "Description of resource 3",
    type: "video",
  },
  {
    title: "Resource 4",
    description: "Description of resource 4",
    type: "article",
  },
  {
    title: "Resource 5",
    description: "Description of resource 5",
    type: "video",
  },
  {
    title: "Resource 6",
    description: "Description of resource 6",
    type: "article",
  },
  {
    title: "Resource 7",
    description: "Description of resource 7",
    type: "video",
  },
  {
    title: "Resource 8",
    description: "Description of resource 8",
    type: "article",
  },
  {
    title: "Resource 9",
    description: "Description of resource 9",
    type: "video",
  },
  {
    title: "Resource 10",
    description: "Description of resource 10",
    type: "article",
  },
  {
    title: "Resource 11",
    description: "Description of resource 11",
    type: "video",
  },
  {
    title: "Resource 12",
    description: "Description of resource 12",
    type: "article",
  },
  {
    title: "Resource 13",
    description: "Description of resource 13",
    type: "video",
  },
  {
    title: "Resource 14",
    description: "Description of resource 14",
    type: "article",
  },
  {
    title: "Resource 15",
    description: "Description of resource 15",
    type: "video",
  },
  {
    title: "Resource 16",
    description: "Description of resource 16",
    type: "article",
  },
  {
    title: "Resource 17",
    description: "Description of resource 17",
    type: "video",
  },
  {
    title: "Resource 18",
    description: "Description of resource 18",
    type: "article",
  },
  {
    title: "Resource 19",
    description: "Description of resource 19",
    type: "video",
  },
  {
    title: "Resource 20",
    description: "Description of resource 20",
    type: "article",
  },
  {
    title: "Resource 21",
    description: "Description of resource 21",
    type: "video",
  },
  {
    title: "Resource 22",
    description: "Description of resource 22",
    type: "article",
  },
  {
    title: "Resource 23",
    description: "Description of resource 23",
    type: "video",
  },
  {
    title: "Resource 24",
    description: "Description of resource 24",
    type: "article",
  },
  {
    title: "Resource 25",
    description: "Description of resource 25",
    type: "video",
  },
  {
    title: "Resource 26",
    description: "Description of resource 26",
    type: "article",
  },
  {
    title: "Resource 27",
    description: "Description of resource 27",
    type: "video",
  },
  {
    title: "Resource 28",
    description: "Description of resource 28",
    type: "article",
  },
  {
    title: "Resource 29",
    description: "Description of resource 29",
    type: "video",
  },
  {
    title: "Resource 30",
    description: "Description of resource 30",
    type: "article",
  },
];

function Resources({ resourceType }) {
  console.log(resourceType);
  return (
    <div className="resources-container">
      <Row gutter={[16, 16]} justify="center" align="middle">
        {resourceData.map((resource, index) => (
          <ResourceCard
            key={index}
            title={resource.title}
            description={resource.description}
            type={resource.type}
          />
        ))}
      </Row>
    </div>
  );
}

export default Resources;
