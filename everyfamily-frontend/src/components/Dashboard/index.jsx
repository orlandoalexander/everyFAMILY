import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import ResourceCard from "../Resources/ResourceCard.jsx";
import useGetCategories from "../../hooks/useGetCategories.js";
import useGetResources from "../../hooks/useGetResources.js";
import useGetTypes from "../../hooks/useGetTypes.js";
import feature1 from "../../assets/everyFAMILY-feature1.png";
import feature2 from "../../assets/everyFAMILY-feature2.png";
import feature3 from "../../assets/everyFAMILY-feature3.png";
import { Button, Segmented } from "antd";
import { ChevronDown, ChevronUp } from "react-feather";
import Category from "./Category.jsx";

const isDemo = import.meta.env.VITE_DEMO;

function Dashboard({ setResourceModalOpen, setResourceModalData }) {
  const [browseByCategory, setBrowseByCategory] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const { data: categoryData } = useGetCategories();
  const { data: typeData } = useGetTypes();
  const { data: resourceData } = useGetResources();

  return (
    <div className="dashboard">
      {!isDemo && (
        <header className="capo-wrapper">
          <h1 className="capo-heading">
            CAPO – Children Affected by Parental Offending
          </h1>

          <h4 className="capo-description">
            At everyFAMILY, we support children who have a parent in prison, addressing the challenges they face in daily life and helping families stay connected.
            Children of prisoners often face a “hidden sentence,” with over 300,000 estimated to be affected in England and Wales. They are at higher risk of mental health issues, may experience nearly five times as many adverse childhood experiences (ACEs) as their peers, and three in four leave the family home when their mother is incarcerated.          </h4>

          {expanded && (
            <div>
              <h2 className="capo-section-title">Our Work</h2>
              <ul className="capo-list">
                <li className="capo-item">
                  <span className="capo-label">Training:</span> We provide training for professionals (police, prisons, probation, health, social care, education) to support families impacted by parental offending.
                </li>
                <li className="capo-item">
                  <span className="capo-label">Support & Resources:</span> We act as a point of contact for professionals seeking guidance or resources for affected families.
                </li>
                <li className="capo-item">
                  <span className="capo-label">CAPO Champions:</span> A network of trained professionals sharing best practices, connecting others to support and CPD opportunities.
                </li>
                <li className="capo-item">
                  <span className="capo-label">Parenting Courses:</span> We deliver courses to mothers in HMP Eastwood Park to maintain family ties, helping reduce reoffending rates.
                </li>
              </ul>

              <h2 className="capo-section-title">Individualised Support</h2>
              <p className="capo-text"><strong>Children:</strong> Six-week interventions where children can express feelings, learn coping strategies, ask questions, and explore support systems.</p>
              <p className="capo-text"><strong>Parents and Carers:</strong> Guidance on managing emotions, addressing children’s questions, and accessing financial or other support.</p>

              <h2 className="capo-section-title">Group Support</h2>
              <p className="capo-text">
                Monthly support groups reduce isolation and stigma. We collaborate with universities and law enforcement projects, including Operation Paramount, to identify children in need and provide early interventions.
              </p>

              <h2 className="capo-section-title">Course Delivery</h2>
              <p className="capo-text">
                Parenting courses for fathers in HMP Bristol, followed by “Family Days” to celebrate achievements and strengthen family bonds. These interactions support ongoing community reintegration and build relationships with everyFAMILY staff.
              </p>
            </div>
          )}

          <Button
            type="text"
            onClick={() => {
              setExpanded(!expanded);
              expanded &&
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 10);
            }}
            icon={expanded ? <ChevronUp strokeWidth="1" /> : <ChevronDown strokeWidth="1" />}
            iconPosition="end"
          >
            {expanded ? "Show Less" : "Keep Reading"}
          </Button>
        </header>
      )}
      <section className="dashboard-featured">
        <div
          className="dashboard-featured-container"
          onClick={() => navigate("/resources?filter=recent")}
        >
          <img src={feature1} />
          <h2>Recently added</h2>
        </div>
        <div
          className="dashboard-featured-container"
          onClick={() => navigate("/resources?filter=featured")}
        >
          <img src={feature2} />
          <h2>Featured</h2>
        </div>
        <div
          className="dashboard-featured-container"
          onClick={() => navigate("/resources?filter=saved")}
        >
          <img src={feature3} />
          <h2>Saved</h2>
        </div>
      </section>
      {resourceData && (
        <div className="dashboard-category">
          <div className="dashboard-category-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.6rem' }}>
              <h1>{browseByCategory ? "Browse by category" : "Browse by media type"}</h1>
              <span
                onClick={() => navigate("/resources")}
                style={{ marginTop: '5px', cursor: 'pointer' }}
              >
                View all resources
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Segmented
                options={["Category", "Media Type"]}
                value={browseByCategory ? "Category" : "Media Type"}
                onChange={(val) => setBrowseByCategory(val === "Category")}
                size='large'
              />
            </div>
          </div>
          {browseByCategory ? (
            categoryData &&
            categoryData.map((category, index) => (
              <Category
                key={index}
                categoryKey={index}
                label={
                  <div className="dashboard-category-title">
                    {category.title}
                    <span
                      onClick={() => {
                        navigate(`/resources?category=${category.title}`);
                      }}
                    >
                      View all
                    </span>
                  </div>
                }
                children={
                  resourceData &&
                  resourceData
                    .filter(({ category_id }) => category_id === category.id)
                    .map((resource, index) => (
                      <ResourceCard
                        key={index}
                        id={resource.id}
                        title={resource.title}
                        link={resource.link}
                        description={resource.description}
                        type={resource.type_title}
                        category={resource.category_title}
                        thumbnail_url={resource.thumbnail_url}
                        setResourceModalOpen={setResourceModalOpen}
                        setResourceModalData={setResourceModalData}
                      />
                    ))
                }
              />
            ))) :

            (typeData &&
              typeData.map((type, index) => (
                <Category
                  key={index}
                  categoryKey={index}
                  label={
                    <div className="dashboard-category-title">
                      {type.title}
                      <span
                        onClick={() => {
                          navigate(`/resources?type=${type.title}`);
                        }}
                      >
                        View all
                      </span>
                    </div>
                  }
                  children={
                    resourceData &&
                    resourceData
                      .filter(({ type_id }) => type_id === type.id)
                      .map((resource, index) => (
                        <ResourceCard
                          key={index}
                          id={resource.id}
                          title={resource.title}
                          link={resource.link}
                          description={resource.description}
                          type={resource.type_title}
                          category={resource.type_title}
                          thumbnail_url={resource.thumbnail_url}
                          setResourceModalOpen={setResourceModalOpen}
                          setResourceModalData={setResourceModalData}
                        />
                      ))
                  }
                />
              )))}

        </div>
      )}
    </div>
  );
}

export default Dashboard;
