import ResourceCard from "./resourceCard.jsx";
// import "./index.css";
import React from 'react';
import {Row, Flex, Collapse } from 'antd';
import Category from "./Category.jsx";
import category from "./Category.jsx";

function Dashboard() {
  const allResources = [
      {title: "A", description: "a", category: "All resources"},
      {title: "B", description: "b", category: "All resources"},
      {title: "C", description: "c", category: "Arrest"},
      {title: "D", description: "d", category: "Court"}
  ]
  const allCategories = ["All resources", "Arrest", "Court", "Imprisonment"]
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
          // showArrow: false,
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
          {/*<Collapse items={items} defaultActiveKey={'1'} size="small" bordered={false} onChange={onChange} gost/>*/}
          {/*{allResources1.map(({description, title, category}, index) => (*/}
          {/*    <Category label={category} children={ <ResourceCard key={index} title={title} description={description} /> } />*/}
          {/*))}*/}
          {allCategories.map((label, index) => (
              <Category
                  categoryKey={index}
                  key={index}
                  label={label}
                  children={
                    allResources
                        .filter(({category}) => category === label)
                        .map(({title, description}, i) =>(
                            <ResourceCard key={i} title={title} description={description} />
                        ))
                    }
              />
          ))}
      </main>
    </div>
  );
}

export default Dashboard;
