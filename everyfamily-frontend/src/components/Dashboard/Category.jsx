import "./Category.css";
import { Collapse, Flex, Row } from "antd";

function Category({ categoryKey, label, children }) {
  const item = [
    {
      key: categoryKey,
      label: label,
      children: (
        <Row gutter={16}>
          <Flex
            className="dashboard-category-flex"
            style={{
              overflowX: "auto", // Enable horizontal scrolling
              whiteSpace: "nowrap", // Prevent the content from wrapping to the next line
              width: "100%", // Ensures that the flex container takes up all available space
            }}
          >
            {children}
          </Flex>
        </Row>
      ),
    },
  ];

  return <Collapse items={item} size="large" bordered={false} ghost />;
}

export default Category;
