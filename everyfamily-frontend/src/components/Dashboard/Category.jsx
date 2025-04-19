import "./Category.css";
import { Collapse, Flex, Row } from "antd";

function Category({ categoryKey, label, children }) {
  const item = [
    {
      key: categoryKey,
      label: label,
      children: (
        <Row gutter={16}>
          <Flex className="dashboard-category-flex">{children}</Flex>
        </Row>
      ),
    },
  ];

  return <Collapse items={item} size="large" bordered={false} ghost />;
}

export default Category;
