import "./resourceCard.css";
import { Card, Col, Avatar } from "antd";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const { Meta } = Card;

function ResourceCard({ title, description }) {
  const actions = [
      <EditOutlined key="edit" />,
      <SettingOutlined key="setting" />,
      <EllipsisOutlined key="ellipsis" />,
  ];
  return (
    <div>
      <Col span={8}>
        <Card
            className="outer--card"
            hoverable
            size="small"
            actions={actions}
            style={{
                width: 200,
                height: 200,
            }}
        >
            <div
                className="outer--card--div"
            >
                <Card
                    className="inner--card"
                    type="inner"
                    style={{
                        width: 175,
                        height: 100,
                    }}
                    cover={
                        <img
                            className="inner--card--img"
                            alt="example"
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        />
                    }
                />
                <p style={{
                    fontSize: 16,
                }}>
                    {title}
                </p>
                <p style={{
                    fontSize: 14,
                }}>
                    {description}
                </p>
            </div>


        </Card>
      </Col>
    </div>
  );
}

export default ResourceCard;
