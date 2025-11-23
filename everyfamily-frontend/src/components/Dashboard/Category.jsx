import "./Category.css";
import { Typography } from "antd";

const { Title } = Typography;

function Category({ label, children }) {
  return (
    <div className="dashboard-category">
      <Title level={4}>{label}</Title>
      <div className="dashboard-category-scroll">
        {children}
      </div>
    </div>
  );
}

export default Category;