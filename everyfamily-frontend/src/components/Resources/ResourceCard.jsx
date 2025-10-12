import { useContext, useState } from "react";
import "./ResourceCard.css";
import { Card, Col, Button, Dropdown } from "antd";
import { Grid, Tag, Bookmark, Star } from "react-feather";
import AuthContext from "../../AuthContext";
import ResourceModal from "./ResourceModal";
import useUpdateResource from "../../hooks/useUpdateResource";
import useAddUserResource from "../../hooks/useAddUserResource";
import useDeleteResource from "../../hooks/useDeleteResource";

const ensureHttps = (url) => (url.startsWith("http") ? url : `https://${url}`);

function ResourceCard({
  id,
  title,
  description,
  link,
  type,
  thumbnail_url,
  category,
  saved,
  featured,
  setResourceModalOpen,
  setResourceModalData,
}) {
  const [isFeatured, setIsFeatured] = useState(featured);
  const [isSaved, setIsSaved] = useState(saved);
  const { user } = useContext(AuthContext);

  const updateResource = useUpdateResource();
  const addUserResource = useAddUserResource();
  const deleteResource = useDeleteResource();
  const safeLink = ensureHttps(link);

  const handleFeatureToggle = () => {
    setIsFeatured((prevState) => !prevState);
    updateResource.mutate({
      id,
      featured: !featured,
    });
  };

  const handleSavedToggle = () => {
    setIsSaved((prevState) => !prevState);
    addUserResource.mutate({
      user_id: user.id,
      resource_id: id,
    });
  };

  const handleDropdownItemClick = (action) => {
    if (action === "modify") {
      setResourceModalOpen(true);
      setResourceModalData({
        title: title,
        description: description,
        type: type,
        category: category,
        link: link,
        thumbnail_url: thumbnail_url,
        id: id,
      });
    }
    if (action === "delete") deleteResource.mutate(id);
  };

  return (
    <div>
      <Col span={8}>
        <Dropdown
          menu={
            user.role === "admin"
              ? {
                  onClick: (e) => handleDropdownItemClick(e.key),
                  items: [
                    {
                      label: "Edit resource",
                      key: "modify",
                    },
                    {
                      label: "Delete resource",
                      key: "delete",
                    },
                  ],
                }
              : {}
          }
          trigger={["contextMenu"]}
          disabled={user.role !== "admin"}
        >
          <Card className="card-container" hoverable size="small">
            <a href={safeLink} target="_blank" rel="noopener noreferrer">
              <div className="outer-card">
                <Card
                  className="inner-card"
                  type="inner"
                  cover={
                    <img
                      alt="example"
                      src={
                        thumbnail_url ||
                        "https://placehold.co/300x200/432666/FFF?text=Thumbnail+\n+Unavailable"
                      }
                      onError={(e) =>
                        (e.target.src =
                          "https://placehold.co/300x200/432666/FFF?text=Thumbnail+\n+Unavailable")
                      }
                    />
                  }
                />

                <p className="card-title">{title}</p>
                <p className="card-description">{description}</p>
              </div>
            </a>
            <section className="card-footer">
              <div className="card-footer-details">
                <div>
                  <Tag color="gray" size={10} />
                  <span>{category}</span>
                </div>
                <div>
                  <Grid color="gray" size={10} />
                  <span>{type}</span>
                </div>
              </div>

              {user.role === "admin" ? (
                <div>
                  <Button
                    type="text"
                    onClick={handleFeatureToggle}
                    icon={
                      <Star
                        color="gray"
                        strokeWidth={1.5}
                        size={23}
                        fill={isFeatured ? "gray" : "transparent"}
                      />
                    }
                  />

                  <Button
                    type="text"
                    onClick={handleSavedToggle}
                    icon={
                      <Bookmark
                        color="gray"
                        strokeWidth={1.5}
                        size={23}
                        fill={isSaved ? "gray" : "transparent"}
                      />
                    }
                  />
                </div>
              ) : (
                <Button
                  type="text"
                  onClick={handleSavedToggle}
                  icon={
                    <Bookmark
                      color="gray"
                      strokeWidth={1.5}
                      size={23}
                      fill={isSaved ? "gray" : "transparent"}
                    />
                  }
                />
              )}
            </section>
          </Card>
        </Dropdown>
      </Col>
    </div>
  );
}

export default ResourceCard;
