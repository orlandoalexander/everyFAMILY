import "./resourceCard.css";
import ResourceType from "./ResourceType.jsx";
import { Card, Col } from "antd";

function ResourceCard({ title, description, link, type }) {
  return (
    <div>
      <Col span={8}>
        <Card className="card-container" hoverable size="small">
          <div className="outer-card">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <Card
                className="inner-card"
                type="inner"
                cover={
                  <img
                    alt="example"
                    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                  />
                }
              />
            </a>
            <p
              style={{
                fontSize: 14,
                fontWeight: "bold",
                padding: 0,
                margin: "10px 5px 5px 5px",
              }}
            >
              {title}
            </p>
            <p
              style={{
                fontSize: 12,
                padding: 0,
                margin: "5px 5px 5px 5px",
              }}
            >
              {description}
            </p>
          </div>
          <div className="card-footer">
            <ResourceType type={type} />
          </div>
        </Card>
      </Col>
    </div>
  );
}

export default ResourceCard;
