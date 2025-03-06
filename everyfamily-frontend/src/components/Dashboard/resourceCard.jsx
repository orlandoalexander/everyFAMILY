import "./ResourceCard.css";
import { Card } from "antd";

function ResourceCard({ title }) {
  return (
    <Card
      hoverable
      style={{
        width: 240,
      }}
      title={title}
      cover={
        <img
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        />
      }
    ></Card>
  );
}

export default ResourceCard;
