import "./Category.css";
import { Collapse, Flex, Row } from "antd";

function Category({ categoryKey, label, children }) {
  const item = [
    {
      key: categoryKey,
      label: label,
      children: (
        <Row gutter={16}>
          <Flex>{children}</Flex>
        </Row>
      ),
    },
  ];
  const onChange = (key) => {
    console.log(key);
  };
  return (
    <Collapse
      items={item}
      size="large"
      bordered={false}
      ghost
      onChange={onChange}
    />
  );
}

export default Category;
