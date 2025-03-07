import "./ResourceCard.css";
import { Card, Col } from "antd";
const { Meta } = Card;

function ResourceCard({ title, description}) {
  return (
    <div className="resource-card">
        <Col span={8}>
            <Card
                hoverable
                className="card-container"
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
                            width: '100%',
                            height: 120,
                            objectFit: 'cover',}}
                    />
                }
            >
                <Meta
                    title={title}
                    description={description}
                    style={{
                        height: 80
                    }}
                />
                {/*<p className='card_title'>{title}</p>*/}
                {/*<p className='card_desciption'>{description}</p>*/}
            </Card>
        </Col>


    </div>
  );
}

export default ResourceCard;
