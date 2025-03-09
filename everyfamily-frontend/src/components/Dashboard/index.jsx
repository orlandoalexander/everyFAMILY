import "./index.css";
import ResourceCard from "./resourceCard.jsx";
import React from "react";
import logo from "../../assets/everyFAMILY-logo.png";
import { Input, Button, Row, Flex, Collapse } from "antd";
import Category from "./Category.jsx";
const { Search } = Input;

function Dashboard() {
    const allResources = [
        {title: "A", description: "a", category: "All resources"},
        {title: "B", description: "b", category: "All resources"},
        {title: "C", description: "c", category: "Arrest"},
        {title: "D", description: "d", category: "Court"}
    ]
    const allCategories = ["All resources", "Arrest", "Court", "Imprisonment"]
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
      <div className="dashboard--category">
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
      </div>


    </main>
  );
}

export default Dashboard;
