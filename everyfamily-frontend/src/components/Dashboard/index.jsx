import ResourceCard from "./resourceCard.jsx";

function Dashboard() {
  const allResources = ["a", "b", "c"];
  return (
    <main className="resourceCards">
      {allResources.map((title, index) => (
        <ResourceCard key={index} title={title} />
      ))}
    </main>
  );
}

export default Dashboard;
