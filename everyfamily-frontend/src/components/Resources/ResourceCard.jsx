import "./resourceCard.css";
import { Card, Col } from "antd";

function ResourceCard({
  title,
  description,
  link,
  type,
  thumbnail_url,
  category_title,
}) {
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
                    src={
                      thumbnail_url ||
                      "https://placehold.co/300x200/432666/FFF?text=Thumbnail+\n+Unavailable"
                    }
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
            <div className="resource-category">{category_title}</div>
          </div>
        </Card>
      </Col>
    </div>
  );
}

export default ResourceCard;
