import "./index.css";
import ResourceCard from "./resourceCard.jsx";
import React from "react";
import logo from "../../assets/everyFAMILY-logo.png";
import { Input, Button, Row, Flex, Collapse } from "antd";

const { Search } = Input;

function Dashboard() {
  const allResources = [
    { title: "A", description: "a" },
    { title: "B", description: "b" },
    { title: "C", description: "c" },
    { title: "D", description: "d" },
    { title: "E", description: "e" },
    { title: "F", description: "f" },
  ];
  const items = [
    {
      key: "1",
      label: "All resources",
      children: (
        <Row gutter={16}>
          <Flex>
            {allResources.map(({ title, description }, index) => (
              <ResourceCard
                key={index}
                title={title}
                description={description}
              />
            ))}
          </Flex>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Arrest",
      children: (
        <Row gutter={16}>
          <Flex>
            {allResources.map(({ title, description }, index) => (
              <ResourceCard
                key={index}
                title={title}
                description={description}
              />
            ))}
          </Flex>
        </Row>
      ),
      showArrow: false,
    },
    {
      key: "3",
      label: "Court",
      children: <p></p>,
    },
    {
      key: "4",
      label: "Imprisonment",
      children: <p></p>,
    },
  ];
  const onChange = (key) => {
    console.log(key);
  };
  return (
    <main>
      <header className="dashboard--header">
        <img
          className="dashboard--header--logo"
          src={logo}
          alt="everyFAMILY logo"
        />
        <Search
          className="dashboard--header--search"
          placeholder="Find resources by name, description etc."
          allowClear
        />
        <Button className="dashboard--header--button" type="primary">
          Add new
        </Button>
      </header>
      <Collapse
        items={items}
        defaultActiveKey={["1"]}
        bordered={false}
        onChange={onChange}
        gost
      />
    </main>
  );
}

export default Dashboard;
