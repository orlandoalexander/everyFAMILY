import ResourceCard from "./resourceCard.jsx";
// import "./index.css";
import React from 'react';
import {Row, Flex, Collapse } from 'antd';

function Dashboard() {
  const allResources = [
      {title: "A", description: "a"}, {title: "B", description: "b"},
      {title: "C", description: "c"}, {title: "D", description: "d"},
      {title: "E", description: "e"}, {title: "F", description: "f"}];
    const items = [
        {
            key: '1',
            label: 'All resources',
            children:
                <Row gutter={16}>
                    <Flex>
                        {allResources.map(({title,description}, index) => (
                            <ResourceCard key={index} title={title} description={description} />
                        ))}
                    </Flex>
                </Row>,
        },
        {
            key: '2',
            label: 'Arrest',
            children:
                <Row gutter={16}>
                    <Flex>
                        {allResources.map(({title,description}, index) => (
                            <ResourceCard key={index} title={title} description={description} />
                        ))}
                    </Flex>
                </Row>,
            showArrow: false,
        },
        {
            key: '3',
            label: 'Court',
            children:<p></p>,
        },
        {
            key: '4',
            label: 'Imprisonment',
            children:<p></p>,
        }
    ];
    const onChange = (key) => {
        console.log(key);
    };
  return (
    <div className="dashboard">
      <main className="browse_by_category">
          <Collapse items={items} defaultActiveKey={['1']} bordered={false} onChange={onChange} gost/>
      </main>
    </div>
  );
}

export default Dashboard;
