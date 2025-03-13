import "./resourceCard.css";
import ResourceType from "./ResourceType.jsx";
import { Card, Col, Avatar } from "antd";
import { AlignLeftOutlined, LinkOutlined, VideoCameraOutlined, CaretRightOutlined, FileTextOutlined } from "@ant-design/icons";
import { HeartOutlined, BookOutlined } from "@ant-design/icons";

const { Meta } = Card;

function ResourceCard({title, description, type}) {
    return (
        <div>
            <Col span={8}>
                <Card
                    className="outer-card"
                    hoverable
                    size="small"
                    style={{
                        width: 200,
                        height: 200,
                    }}
                >
              <div
                  className="outer-card-div"
              >
                  <Card
                      className="inner-card"
                      type="inner"
                      style={{
                          width: 175,
                          height: 100,
                      }}
                      cover={
                          <img
                              className="inner-card-img"
                              alt="example"
                              src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                          />
                      }
                  />
                  <p style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      padding: 0,
                      margin: "10px 5px 5px 5px"
                  }}>
                      {title}
                  </p>
                  <p style={{
                      fontSize: 12,
                      padding: 0,
                      margin: "5px 5px 5px 5px"
                  }}>
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
