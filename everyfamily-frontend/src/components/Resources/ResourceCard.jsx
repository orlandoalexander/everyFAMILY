import { useContext } from "react";
import "./resourceCard.css";
import { Card, Col, Button } from "antd";
import { Grid, Tag, Bookmark, Star } from "react-feather";
import AuthContext from "../../AuthContext";

const ensureHttps = (url) => (url.startsWith("http") ? url : `https://${url}`);

function ResourceCard({
  title,
  description,
  link,
  type,
  thumbnail_url,
  category,
  saved,
  featured,
}) {
  const { user } = useContext(AuthContext);
  const safeLink = ensureHttps(link);

  return (
    <div>
      <Col span={8}>
        <Card className="card-container" hoverable size="small">
          <div className="outer-card">
            <a href={safeLink} target="_blank" rel="noopener noreferrer">
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
          <section className="card-footer">
            <div className="card-footer-details">
              <div>
                <Tag color="gray" size={10} />
                <p>{category}</p>
              </div>
              <div>
                <Grid color="gray" size={10} />
                <p>{type}</p>
              </div>
            </div>
            {user.role === "admin" ? (
              <div className="card-footer-buttons">
                <Button
                  type="text"
                  icon={
                    <Star
                      color="gray"
                      strokeWidth={1.5}
                      size={27}
                      fill={featured ? "gray" : "transparent"}
                    />
                  }
                />

                <Button
                  type="text"
                  icon={
                    <Bookmark
                      color="gray"
                      strokeWidth={1.5}
                      size={27}
                      fill={saved ? "gray" : "transparent"}
                    />
                  }
                />
              </div>
            ) : (
              <Button
                type="text"
                icon={
                  <Bookmark
                    color="gray"
                    strokeWidth={1.5}
                    size={27}
                    fill={saved ? "gray" : ""}
                  />
                }
              />
            )}
          </section>
        </Card>
      </Col>
    </div>
  );
}

export default ResourceCard;
