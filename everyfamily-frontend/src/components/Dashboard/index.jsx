import "./index.css";
import ResourceCard from "./resourceCard.jsx";
import logo from "../../assets/everyFAMILY-logo.png";
import { Input, Button } from "antd";

const { Search } = Input;

function Dashboard() {
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
      {/* <section >
        {allResources.map((title, index) => (
          <ResourceCard key={index} title={title} />
        ))}
      </section> */}
    </main>
  );
}

export default Dashboard;
