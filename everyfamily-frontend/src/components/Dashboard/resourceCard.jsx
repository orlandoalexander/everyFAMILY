import "./ResourceCard.css";
import { Card, Col } from "antd";
const { Meta } = Card;

function ResourceCard({ title, description }) {
  return (
    <div>
      <Col span={8}>
        <Card
          hoverable
          size="small"
          style={{
            width: 200,
            height: 200,
          }}
          cover={
            <img
              alt="example"
              src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
              style={{
                width: "100%",
                height: 120,
                objectFit: "cover",
              }}
            />
          }
        >
          <Meta
            title={title}
            description={description}
            style={{
              height: 80,
            }}
          />
        </Card>
      </Col>
    </div>
  );
}

export default ResourceCard;
