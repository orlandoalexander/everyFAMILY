import React from "react";
import "./ResourceType.css";
import { AlignLeft, Link, Video } from "react-feather";
import { Heart, Bookmark } from "react-feather";

function ResourceType({ type }) {
  if (type === "article") {
    return (
      <div className="resource-type">
        <AlignLeft size={15} />
        <span>Article</span>
      </div>
    );
  } else if (type === "video") {
    return (
      <div className="resource-type">
        <Video size={15} />
        <span>Video</span>
      </div>
    );
  } else return null;
}

export default ResourceType;
