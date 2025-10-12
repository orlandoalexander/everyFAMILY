import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import ResourceCard from "../Resources/ResourceCard.jsx";
import useGetCategories from "../../hooks/useGetCategories.js";
import useGetResources from "../../hooks/useGetResources.js";
import feature1 from "../../assets/everyFAMILY-feature1.png";
import feature2 from "../../assets/everyFAMILY-feature2.png";
import feature3 from "../../assets/everyFAMILY-feature3.png";
import { Button } from "antd";
import { ChevronDown, ChevronUp } from "react-feather";
import Category from "./Category.jsx";

const isDemo = import.meta.env.VITE_DEMO;

function Dashboard({ setResourceModalOpen, setResourceModalData }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const { data: categoryData } = useGetCategories();
  const { data: resourceData } = useGetResources();

  return (
    <div className="dashboard">
      {!isDemo && (
        <header className="capo-wrapper">
          <h1 className="capo-heading">
            CAPO - CHILDREN AFFECTED BY PARENTAL OFFENDING
          </h1>

          <h4 className="capo-description">
            At everyFAMILY, we spearhead a regional initiative in South
            Gloucestershire and North Somerset to support Children Affected by
            Parental Offending (CAPO).
          </h4>

          {expanded && (
            <div>
              <h2 className="capo-section-title">Our Work</h2>

              <ul className="capo-list">
                <li className="capo-item">
                  <span className="capo-label">Training:</span> We provide
                  training for professionals (police, prisons, probation,
                  health, social care, education) who work directly with
                  families impacted by parental offending and imprisonment.
                </li>
                <li className="capo-item">
                  <span className="capo-label">Support &amp; Resources:</span>{" "}
                  We serve as a point of contact for professionals seeking
                  support or resources for families they are assisting.
                </li>
                <li className="capo-item">
                  <span className="capo-label">CAPO Champions:</span> We
                  facilitate a network of “CAPO Champions” – professionals
                  across the region who can connect for CPD training,
                  networking, and best practice sharing. Champions are the
                  significant point of contact within their setting for those
                  wishing to access CAPO support.
                </li>
                <li className="capo-item">
                  <span className="capo-label">Parenting Courses:</span> We
                  deliver parenting courses to mothers residing in HMP Eastwood
                  Park, aiming to maintain crucial family ties, which research
                  (The Golden Thread – The Centre for Social Justice) has shown
                  to reduce reoffending rates.
                </li>
              </ul>

              <h4 className="capo-description">
                As part of the South Gloucestershire CAPO contract, we provide
                direct interventions for children in need of support due to
                parental offending.
              </h4>

              <h2 className="capo-section-title">Individualised Support</h2>
              <p className="capo-text">
                <strong>Children</strong> - We offer 6-week interventions where
                children can:
              </p>
              <ul className="capo-list">
                <li>Express their feelings about family imprisonment.</li>
                <li>Learn coping mechanisms.</li>
                <li>Have their questions answered.</li>
                <li>Explore available support systems.</li>
              </ul>

              <p className="capo-text">
                <strong>Parents and Carers</strong> - We support parents and
                carers by:
              </p>
              <ul className="capo-list">
                <li>Helping them manage their own emotions.</li>
                <li>
                  Guiding them on how to address the children’s questions.
                </li>
                <li>
                  Providing referrals for financial and other relevant support.
                </li>
              </ul>
              <h2 className="capo-section-title">Group Support</h2>
              <div className="capo-text">
                <p>
                  We facilitate monthly support groups for children and families
                  to reduce feelings of isolation and stigma.
                </p>
                <p>
                  To combat stigma and reduce isolation for families impacted by
                  parental imprisonment, we actively participate in networking
                  events to raise awareness of this issue.
                </p>
                <p>
                  We collaborate closely with The University of Bristol and are
                  currently working with Dr Mine Conkbayir on research exploring
                  the link between Adverse Childhood Experiences (ACEs) and
                  imprisonment in later life.
                </p>
                <p>
                  <strong>everyFAMILY</strong> serve as the nominated charity
                  for <strong>Operation Paramount in Bristol</strong>. This
                  pilot, in partnership with Avon and Somerset Police, starting
                  in July 2025, will aim to rapidly identify children with a
                  parent in prison, targeting a swift offer of support for the
                  whole family.
                </p>

                <strong>
                  We have also recently secured a two-year grant to deliver
                  parenting courses within HMP Bristol.
                </strong>
              </div>
              <h2 className="capo-section-title">Course Delivery</h2>
              <p className="capo-text">
                We work directly with fathers residing at HMP Bristol,
                facilitating parenting courses. Following course completion, we
                organise “Family Days” within the prison.
              </p>

              <strong className="capo-text">
                These events offer fathers the opportunity to receive their
                certificates and celebrate their course completion with their
                families.
              </strong>
              <ul className="capo-list">
                <li>
                  <strong>Family Bonding:</strong> Families spend quality time
                  together, fostering stronger bonds.
                </li>
                <li>
                  <strong>Building Relationships:</strong> Families build
                  relationships with everyFAMILY staff, facilitating ongoing
                  support.
                </li>
                <li>
                  <strong>Community Reintegration:</strong> These interactions
                  enable us to offer continued support to families within the
                  community following their relative’s release.
                </li>
              </ul>
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
            icon={
              expanded ? (
                <ChevronUp strokeWidth="1" />
              ) : (
                <ChevronDown strokeWidth="1" />
              )
            }
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
          <div className="dashboard-category-title">
            <h1>Browse by category</h1>
            <span
              onClick={() => {
                navigate("/resources");
              }}
            >
              View all
            </span>
          </div>
          {categoryData &&
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
            ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
